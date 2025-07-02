window.addEventListener('DOMContentLoaded', () => {
  const sourcePath = document.getElementById('sourcePath');
  const browseBtn = document.getElementById('browseBtn');
  const exportBtn = document.getElementById('exportBtn');
  const result = document.getElementById('result');

  browseBtn.onclick = async () => {
    const folder = await window.electronAPI.openFolderDialog();
    if (folder) sourcePath.value = folder;
  };

  exportBtn.onclick = async () => {
    result.textContent = '';
    const columns = Array.from(document.querySelectorAll('.col:checked')).map(cb => cb.value);
    if (!sourcePath.value) {
      result.textContent = 'Vui lòng chọn thư mục nguồn!';
      result.className = 'result error';
      return;
    }
    if (columns.length === 0) {
      result.textContent = 'Vui lòng chọn ít nhất một cột!';
      result.className = 'result error';
      return;
    }
    const options = {
      sourcePath: sourcePath.value,
      recursive: document.getElementById('recursive').checked,
      fileTypes: document.getElementById('fileTypes').value.split(','),
      columns
    };
    const res = await window.electronAPI.processFiles(options);
    result.textContent = res.message;
    result.className = 'result' + (res.success ? '' : ' error');
  };
}); 