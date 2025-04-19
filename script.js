// Fungsi untuk memotong teks jika melebihi batas huruf
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...'; // Potong teks dan tambahkan ...
    }
    return text; // Kembalikan teks asli jika tidak melebihi batas
}

// Fungsi untuk memuat data dari localStorage
function loadSavedData() {
    const savedInput = localStorage.getItem('savedInput');
    if (savedInput) {
        document.getElementById('names').value = savedInput;
    }

    const selectedNames = JSON.parse(localStorage.getItem('selectedNames')) || [];
    const selectedList = document.getElementById('selected-list');
    selectedList.innerHTML = '';

    selectedNames.forEach((name, index) => {
        const selectedItem = document.createElement('div');
        
        // Buat elemen <span> untuk nomor urut dengan background
        const numberSpan = document.createElement('span');
        numberSpan.textContent = `${index + 1}.`;
        numberSpan.className = 'bg-blue-500 text-white px-2 py-1 rounded-full mr-2'; // Styling untuk nomor urut

        // Gabungkan nomor urut dan nama
        selectedItem.appendChild(numberSpan);
        selectedItem.appendChild(document.createTextNode(` ${name}`)); // Tambahkan nama setelah nomor urut

        selectedItem.className = 'bg-gray-100 p-2 rounded-lg flex items-center'; // Styling untuk item
        selectedList.appendChild(selectedItem);
    });
}

// Fungsi untuk menyimpan data ke localStorage
function saveData() {
    const inputValue = document.getElementById('names').value;
    localStorage.setItem('savedInput', inputValue);

    const selectedNames = JSON.parse(localStorage.getItem('selectedNames')) || [];
    localStorage.setItem('selectedNames', JSON.stringify(selectedNames));
}

// Fungsi untuk menghapus semua data
function resetData() {
    localStorage.removeItem('savedInput');
    localStorage.removeItem('selectedNames');

    document.getElementById('names').value = '';
    document.getElementById('result').textContent = ':';
    document.getElementById('selected-list').innerHTML = '';
}

// Fungsi untuk mengambil data dari file JSON
async function fetchData() {
    try {
        const response = await fetch('mhs.json'); // Ambil data dari file data.json
        const data = await response.json(); // Ubah response ke format JSON
        return data;
    } catch (error) {
        console.error('Gagal mengambil data:', error);
        return [];
    }
}

// Fungsi untuk mengisi textarea dengan data JSON
async function fillTextarea() {
    const data = await fetchData(); // Ambil data dari file JSON
    const textarea = document.getElementById('names');

    // Ubah array JSON menjadi string dengan dipisahkan oleh newline (\n)
    const namesString = data.join('\n');

    // Masukkan string ke dalam textarea
    textarea.value = namesString;

    // Simpan data ke localStorage
    saveData();
}

// Memuat data saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadSavedData);

// Menyimpan data setiap kali textarea diubah
document.getElementById('names').addEventListener('input', saveData);

// Tombol Putar
document.getElementById('spin').addEventListener('click', function () {
    const namesInput = document.getElementById('names').value;
    let namesArray = namesInput.split('\n').map(name => name.trim()).filter(name => name.length > 0);

    if (namesArray.length === 0) {
        alert('Tidak ada nama yang tersedia untuk dipilih!');
        return;
    }

    // Tampilkan overlay dan loader
    const overlay = document.getElementById('overlay');
    const loader = document.getElementById('loader');
    overlay.style.display = 'block'; // Tampilkan overlay
    loader.classList.remove('hidden'); // Tampilkan loader

    // Simulasikan proses acak dengan delay 2 detik
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * namesArray.length);
        let winner = namesArray[randomIndex];

        // Terapkan filter batas huruf pada hasil result
        const maxLength = 24; // Batas maksimal 24 karakter
        winner = truncateText(winner, maxLength);

        // Sembunyikan overlay dan loader
        overlay.style.display = 'none'; // Sembunyikan overlay
        loader.classList.add('hidden'); // Sembunyikan loader

        // Tampilkan hasil
        document.getElementById('result').textContent = `:${winner}`;

        // Hapus nama yang sudah terpilih dari daftar
        namesArray.splice(randomIndex, 1);
        document.getElementById('names').value = namesArray.join('\n');

        // Simpan perubahan pada textarea ke localStorage
        saveData();

        // Tambahkan nama yang sudah terpilih ke daftar hasil
        const selectedList = document.getElementById('selected-list');
        const selectedItem = document.createElement('div');
        const selectedNames = JSON.parse(localStorage.getItem('selectedNames')) || [];
        selectedNames.push(winner); // Tambahkan nama ke array
        localStorage.setItem('selectedNames', JSON.stringify(selectedNames)); // Simpan ke localStorage

        // Buat elemen <span> untuk nomor urut dengan background
        const numberSpan = document.createElement('span');
        numberSpan.textContent = `${selectedNames.length}.`;
        numberSpan.className = 'bg-input-bg font-bold text-sm text-black px-1 py-1 mr-1 custom-border'; // Styling untuk nomor urut

        // Gabungkan nomor urut dan nama
        selectedItem.appendChild(numberSpan);
        selectedItem.appendChild(document.createTextNode(` ${winner}`)); // Tambahkan nama setelah nomor urut

        selectedItem.className = 'p-2 rounded-lg font-bold text-xl flex items-center'; // Styling untuk item
        selectedList.appendChild(selectedItem);
    }, 2000); // Delay 2 detik untuk simulasi proses
});

// Tombol Reset
document.getElementById('reset').addEventListener('click', resetData);

// Tambahkan event listener ke tombol "MHSC"
document.getElementById('btn-mhsc').addEventListener('click', fillTextarea);