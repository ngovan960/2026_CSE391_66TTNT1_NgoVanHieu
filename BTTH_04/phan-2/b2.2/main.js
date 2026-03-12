const form = document.getElementById('orderForm');
const productEl = document.getElementById('product');
const quantityEl = document.getElementById('quantity');
const dateEl = document.getElementById('deliveryDate');
const addressEl = document.getElementById('address');
const notesEl = document.getElementById('notes');
const totalPriceDisplay = document.getElementById('totalPriceDisplay');
const charCounter = document.getElementById('charCounter');
const confirmModal = document.getElementById('confirmModal');
const summaryContent = document.getElementById('summaryContent');

let currentTotal = 0;
const prices = {
    "Áo": 150000,
    "Quần": 200000,
    "Giày": 250000
};

function calculateTotal() {
    const product = productEl.value;
    const quantity = parseInt(quantityEl.value) || 0;
    
    if (product && quantity > 0 && quantity <= 99) {
        currentTotal = prices[product] * quantity;
        totalPriceDisplay.innerText = Number(currentTotal).toLocaleString("vi-VN") + " VNĐ";
    } else {
        currentTotal = 0;
        totalPriceDisplay.innerText = "0 VNĐ";
    }
}
productEl.addEventListener('change', calculateTotal);
quantityEl.addEventListener('input', calculateTotal);

notesEl.addEventListener('input', function() {
    const length = this.value.length;
    charCounter.innerText = `${length}/200`;
    
    if (length > 200) {
        charCounter.classList.add('limit-exceeded');
        showError(notesEl, 'notesError', 'Ghi chú không được vượt quá 200 ký tự.');
    } else {
        charCounter.classList.remove('limit-exceeded');
        clearError(notesEl, 'notesError');
    }
});

function showError(element, errorId, message) {
    element.classList.add('input-error');
    document.getElementById(errorId).innerText = message;
}

function clearError(element, errorId) {
    element.classList.remove('input-error');
    document.getElementById(errorId).innerText = '';
}

const inputs = [productEl, quantityEl, dateEl, addressEl];
inputs.forEach(input => {
    input.addEventListener('input', () => clearError(input, input.id + 'Error'));
    input.addEventListener('change', () => clearError(input, input.id + 'Error'));
});
document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', () => document.getElementById('paymentError').innerText = '');
});

function validateForm() {
    let isValid = true;

    if (productEl.value === "") {
        showError(productEl, 'productError', 'Vui lòng chọn sản phẩm.');
        isValid = false;
    }

    const slg = parseInt(quantityEl.value);
    if (!quantityEl.value || isNaN(slg) || slg < 1 || slg > 99) {
        showError(quantityEl, 'quantityError', 'Số lượng phải từ 1 đến 99.');
        isValid = false;
    }

    const dateValue = dateEl.value;
    if (!dateValue) {
        showError(dateEl, 'dateError', 'Vui lòng chọn ngày giao hàng.');
        isValid = false;
    } else {
        const [year, month, day] = dateValue.split('-');
        const selectedDate = new Date(year, month - 1, day); 
        const selectedTimestamp = selectedDate.getTime(); 
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const todayTimestamp = today.getTime(); 
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 30); 
        maxDate.setHours(0, 0, 0, 0);
        const maxTimestamp = maxDate.getTime(); 

        if (selectedTimestamp < todayTimestamp) {
            showError(dateEl, 'dateError', 'Ngày giao hàng không được trong quá khứ.');
            isValid = false;
        } else if (selectedTimestamp > maxTimestamp) {
            showError(dateEl, 'dateError', 'Ngày giao hàng không quá 30 ngày từ hôm nay.');
            isValid = false;
        }
    }

    if (addressEl.value.trim().length < 10) {
        showError(addressEl, 'addressError', 'Địa chỉ giao hàng không được trống và phải >= 10 ký tự.');
        isValid = false;
    }

    const paymentChecked = document.querySelector('input[name="payment"]:checked');
    if (!paymentChecked) {
        document.getElementById('paymentError').innerText = 'Vui lòng chọn phương thức thanh toán.';
        isValid = false;
    }

    if (notesEl.value.length > 200) {
        isValid = false; 
    }

    return isValid;
}

form.addEventListener('submit', function(e) {
    e.preventDefault(); 

    if (validateForm()) {
        
        const paymentChecked = document.querySelector('input[name="payment"]:checked').value;
        const totalFormatted = Number(currentTotal).toLocaleString("vi-VN") + " VNĐ";

        const htmlSummary = `
            <p><strong>Sản phẩm:</strong> ${productEl.value}</p>
            <p><strong>Số lượng:</strong> ${quantityEl.value}</p>
            <p><strong>Ngày giao:</strong> ${dateEl.value}</p>
            <p><strong>Địa chỉ:</strong> ${addressEl.value.trim()}</p>
            <p><strong>Thanh toán:</strong> ${paymentChecked}</p>
            <p><strong>Tổng tiền:</strong> <span class="final-total-price">${totalFormatted}</span></p> 
            <p><strong>Ghi chú:</strong> ${notesEl.value.trim() || '<i>Không có</i>'}</p>
        `;
        
        summaryContent.innerHTML = htmlSummary; 
        confirmModal.style.display = "flex";
    }
});

document.getElementById('btnCancel').addEventListener('click', function() {
    confirmModal.style.display = "none"; 
});

document.getElementById('btnConfirm').addEventListener('click', function() {
    confirmModal.style.display = "none"; 
    alert('Đặt hàng thành công');
    form.reset(); 
    totalPriceDisplay.innerText = "0 VNĐ"; 
    charCounter.innerText = "0/200";
    charCounter.classList.remove('limit-exceeded');
    currentTotal = 0;
});