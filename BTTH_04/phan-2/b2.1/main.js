// ========================================
// FORM ĐĂNG KÝ - VALIDATION JAVASCRIPT
// ========================================

// Lấy các phần tử từ DOM
const form = document.getElementById("registerForm");
const successMessage = document.getElementById("successMessage");
const successName = document.getElementById("successName");

// ========================================
// HÀM UTILITY - HIỂN THỊ VÀ XÓA LỖI
// ========================================

/**
 * Hiển thị thông báo lỗi cho một trường
 * @param {string} fieldId - ID của trường
 * @param {string} message - Nội dung thông báo lỗi
 */
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(`${fieldId}-error`);

  // Thêm class error vào form-group
  field.closest(".form-group").classList.add("error");
  // Hiển thị thông báo lỗi
  errorElement.textContent = message;
}

/**
 * Xóa thông báo lỗi cho một trường
 * @param {string} fieldId - ID của trường
 */
function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(`${fieldId}-error`);

  // Loại bỏ class error từ form-group
  field.closest(".form-group").classList.remove("error");
  // Xóa thông báo lỗi
  errorElement.textContent = "";
}

// ========================================
// HÀM VALIDATE CHO TỪNG TRƯỜNG
// ========================================

/**
 * Kiểm tra Họ và tên
 * @returns {boolean} true nếu hợp lệ, false nếu không
 */
function validateFullname() {
  const fullname = document.getElementById("fullname").value.trim();

  if (!fullname || fullname.length < 3) {
    showError("fullname", "Họ tên phải ít nhất 3 ký tự");
    return false;
  }
  clearError("fullname");
  return true;
}

/**
 * Kiểm tra Email
 * @returns {boolean} true nếu hợp lệ, false nếu không
 */
function validateEmail() {
  const email = document.getElementById("email").value.trim();
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !regexEmail.test(email)) {
    showError("email", "Email không hợp lệ");
    return false;
  }
  clearError("email");
  return true;
}

/**
 * Kiểm tra Số điện thoại
 * @returns {boolean} true nếu hợp lệ, false nếu không
 */
function validatePhone() {
  const phone = document.getElementById("phone").value.trim();
  const regexPhone = /^0[0-9]{9}$/;

  if (!phone || !regexPhone.test(phone)) {
    showError("phone", "Số điện thoại phải bắt đầu 0 và có 10 chữ số");
    return false;
  }
  clearError("phone");
  return true;
}

/**
 * Kiểm tra Mật khẩu
 * @returns {boolean} true nếu hợp lệ, false nếu không
 */
function validatePassword() {
  const password = document.getElementById("password").value;
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!password || !regexPassword.test(password)) {
    showError(
      "password",
      "Mật khẩu ít nhất 8 ký tự, có chữ hoa, chữ thường, số",
    );
    return false;
  }
  clearError("password");
  return true;
}

/**
 * Kiểm tra Xác nhận mật khẩu
 * @returns {boolean} true nếu hợp lệ, false nếu không
 */
function validateConfirmPassword() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!confirmPassword || password !== confirmPassword) {
    showError("confirmPassword", "Xác nhận mật khẩu không khớp");
    return false;
  }
  clearError("confirmPassword");
  return true;
}

/**
 * Kiểm tra Giới tính
 * @returns {boolean} true nếu hợp lệ, false nếu không
 */
function validateGender() {
  const gender = document.querySelector('input[name="gender"]:checked');

  if (!gender) {
    showError("gender", "Vui lòng chọn giới tính");
    return false;
  }
  clearError("gender");
  return true;
}

/**
 * Kiểm tra Điều khoản
 * @returns {boolean} true nếu hợp lệ, false nếu không
 */
function validateTerms() {
  const terms = document.getElementById("terms").checked;

  if (!terms) {
    showError("terms", "Vui lòng đồng ý với điều khoản");
    return false;
  }
  clearError("terms");
  return true;
}

// ========================================
// XỬ LÝ SỰ KIỆN BLUR (Validate khi rời khỏi trường)
// ========================================

document.getElementById("fullname").addEventListener("blur", validateFullname);
document.getElementById("email").addEventListener("blur", validateEmail);
document.getElementById("phone").addEventListener("blur", validatePhone);
document.getElementById("password").addEventListener("blur", validatePassword);
document
  .getElementById("confirmPassword")
  .addEventListener("blur", validateConfirmPassword);

// Để kiểm tra giới tính khi bấm vào radio button
document.querySelectorAll('input[name="gender"]').forEach((radio) => {
  radio.addEventListener("change", validateGender);
});

// Để kiểm tra điều khoản khi bấm vào checkbox
document.getElementById("terms").addEventListener("change", validateTerms);

// ========================================
// XỬ LÝ SỰ KIỆN INPUT (Xóa lỗi khi nhập lại)
// ========================================

document
  .getElementById("fullname")
  .addEventListener("input", () => clearError("fullname"));
document
  .getElementById("email")
  .addEventListener("input", () => clearError("email"));
document
  .getElementById("phone")
  .addEventListener("input", () => clearError("phone"));
document
  .getElementById("password")
  .addEventListener("input", () => clearError("password"));
document
  .getElementById("confirmPassword")
  .addEventListener("input", () => clearError("confirmPassword"));

// ========================================
// XỬ LÝ SỰ KIỆN SUBMIT
// ========================================

form.addEventListener("submit", function (event) {
  event.preventDefault(); // Ngăn chặn hành động gửi form mặc định

  // TODO: Gọi tất cả hàm validate
  // Sử dụng toán tử & (bitwise AND) thay vì && để đảm bảo tất cả hàm đều được gọi
  // Ví dụ: const isValid = validateFullname() & validateEmail() & ... ;

  // Thay đổi đoạn này theo cấu trúc của bạn
  const isValid =
    validateFullname() &
    validateEmail() &
    validatePhone() &
    validatePassword() &
    validateConfirmPassword() &
    validateGender() &
    validateTerms();

  if (isValid) {
    // TODO: Hiển thị thông báo thành công
    const fullname = document.getElementById("fullname").value.trim();
    successName.textContent = fullname;
    form.style.display = "none";
    successMessage.style.display = "block";
  }
});
