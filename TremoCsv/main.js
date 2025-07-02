const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 650,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('open-folder-dialog', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  if (canceled) {
    return null;
  } else {
    return filePaths[0];
  }
});

function scanFiles(dir, recursive, fileTypes, allFiles = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && recursive) {
      scanFiles(filePath, recursive, fileTypes, allFiles);
    } else if (stat.isFile()) {
      const ext = path.extname(file).toLowerCase();
      if (fileTypes.includes(ext)) {
        allFiles.push({ path: filePath, stat });
      }
    }
  }
  return allFiles;
}

ipcMain.handle('process-files', async (event, options) => {
  const { sourcePath, recursive, fileTypes, columns } = options;

  if (!sourcePath || !fs.existsSync(sourcePath)) {
    return { success: false, message: 'Thư mục nguồn không hợp lệ.' };
  }

  try {
    const types = fileTypes.map(t => t.trim().toLowerCase()).filter(t => t);
    const allFiles = scanFiles(sourcePath, recursive, types);

    if (allFiles.length === 0) {
      return { success: false, message: 'Không tìm thấy file nào phù hợp với tiêu chí.' };
    }
    
    const records = allFiles.map(fileInfo => {
        const record = {};
        if (columns.includes('name')) record.name = path.basename(fileInfo.path, path.extname(fileInfo.path));
        if (columns.includes('path')) record.path = fileInfo.path;
        if (columns.includes('type')) record.type = path.extname(fileInfo.path);
        if (columns.includes('size')) record.size = (fileInfo.stat.size / 1024).toFixed(2);
        if (columns.includes('created')) record.created = fileInfo.stat.birthtime.toLocaleString();
        return record;
    });

    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Lưu file CSV',
      defaultPath: path.join(app.getPath('documents'), 'TremoCsv_Export.csv'),
      filters: [{ name: 'CSV Files', extensions: ['csv'] }],
    });

    if (canceled || !filePath) {
      return { success: false, message: 'Đã hủy thao tác lưu file.' };
    }

    const csvHeader = [];
    if (columns.includes('name')) csvHeader.push({ id: 'name', title: 'Name' });
    if (columns.includes('path')) csvHeader.push({ id: 'path', title: 'Path' });
    if (columns.includes('type')) csvHeader.push({ id: 'type', title: 'Type' });
    if (columns.includes('size')) csvHeader.push({ id: 'size', title: 'Size (KB)' });
    if (columns.includes('created')) csvHeader.push({ id: 'created', title: 'Created Date' });

    // Ghi BOM để đọc tốt tiếng Việt
    const bom = Buffer.from('\uFEFF', 'utf8');
    fs.writeFileSync(filePath, bom);
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: csvHeader,
      encoding: 'utf8'
    });
    await csvWriter.writeRecords(records);

    return { success: true, message: `Xuất thành công ${records.length} file ra ${filePath}` };

  } catch (error) {
    console.error('Lỗi khi xử lý file:', error);
    return { success: false, message: `Đã xảy ra lỗi: ${error.message}` };
  }
}); 