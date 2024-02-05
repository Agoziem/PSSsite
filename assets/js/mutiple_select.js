const selectBox = document.querySelector('.select-box');
const selectDropdown = document.querySelector('.dropdown');
const searchInput = document.querySelector('.search input[type="text"]');
const options = document.querySelectorAll('.dropdown-item input[type="checkbox"]');
const itemIdsInput = document.querySelector('#item_ids');

// Toggle dropdown
selectBox.addEventListener('click', () => {
    selectDropdown.classList.toggle('show');
});

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
    if (!selectBox.contains(event.target) && !selectDropdown.contains(event.target)) {
        selectDropdown.classList.remove('show');
    }
});

// Filter options based on search input
searchInput.addEventListener('keyup', () => {
    const filter = searchInput.value.toLowerCase();
    options.forEach(option => {
        const text = option.parentElement.textContent.toLowerCase();
        if (text.indexOf(filter) !== -1) {
            option.parentElement.style.display = 'flex';
        } else {
            option.parentElement.style.display = 'none';
        }
    });
});

// Update select box text and value when options are checked/unchecked
options.forEach(option => {
    option.addEventListener('change', () => {
        let selectedOptions = [];
        options.forEach(option => {
            if (option.checked) {
                selectedOptions.push(option.value);
            }
        });
        if (selectedOptions.length === 0) {
            selectBox.querySelector('span').textContent = 'Select options';
            itemIdsInput.value = '';
        } else if (selectedOptions.length === 1) {
            selectBox.querySelector('span').textContent = `option ${selectedOptions[0]}`;
            itemIdsInput.value = selectedOptions[0];
        } else if (selectedOptions.length === options.length) {
            selectBox.querySelector('span').textContent = 'All options';
            itemIdsInput.value = 'all';
        } else {
            selectBox.querySelector('span').textContent = `${selectedOptions.length} options selected`;
            itemIdsInput.value = selectedOptions.join(',');
        }
    });
});





// 
