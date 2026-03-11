// Mảng chứa dữ liệu sinh viên
let students = [
  { id: 1, name: "Nguyễn Văn A", score: 8.5 },
  { id: 2, name: "Trần Thị B", score: 4.0 },
];

let nextId = 3; // ID cho sinh viên tiếp theo
let filteredStudents = [...students]; // Mảng sinh viên được hiển thị (sau khi lọc)

// Lấy các phần tử DOM
const nameInput = document.getElementById("name");
const scoreInput = document.getElementById("score");
const addButton = document.getElementById("add-btn");
const searchInput = document.getElementById("search");
const tbody = document.getElementById("tbody");
const sumStudentEl = document.getElementById("sum-student");
const avgEl = document.getElementById("avg");

/**
 * Hàm tính xếp loại dựa trên điểm
 */
function getClassification(score) {
  score = Number(score);
  if (score >= 8.5) return "Giỏi";
  if (score >= 7.0) return "Khá";
  if (score >= 5.0) return "Trung bình";
  return "Yếu";
}

/**
 * Hàm lấy class CSS cho xếp loại
 */
function getClassificationClass(score) {
  score = Number(score);
  if (score >= 8.5) return "xeploai-gioi";
  if (score >= 7.0) return "xeploai-kha";
  if (score >= 5.0) return "xeploai-trungbinh";
  return "xeploai-yeu";
}

/**
 * Hàm vẽ lại bảng dữ liệu
 */
function renderTable() {
  // Xóa trắng tbody
  tbody.innerHTML = "";

  // Nếu không có kết quả lọc
  if (filteredStudents.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #999;">Không có kết quả</td></tr>';
    updateStatistics();
    return;
  }

  // Thêm các hàng mới từ filteredStudents
  filteredStudents.forEach((student, displayIndex) => {
    const row = document.createElement("tr");
    const score = Number(student.score);
    const classification = getClassification(score);
    const classificationClass = getClassificationClass(score);

    // Thêm class row-low-score nếu điểm < 5.0
    let rowClass = "";
    if (score < 5.0) {
      rowClass = "row-low-score";
    }

    row.className = rowClass;
    row.innerHTML = `
            <td>${displayIndex + 1}</td>
            <td>${student.name}</td>
            <td>${student.score}</td>
            <td class="${classificationClass}">${classification}</td>
            <td><button class="btn-del" data-student-id="${student.id}">Xóa</button></td>
        `;

    tbody.appendChild(row);
  });

  // Cập nhật thống kê
  updateStatistics();
}

/**
 * Hàm cập nhật thống kê
 */
function updateStatistics() {
  const totalStudents = filteredStudents.length;
  let totalScore = 0;

  filteredStudents.forEach((student) => {
    totalScore += Number(student.score);
  });

  const averageScore =
    totalStudents > 0 ? (totalScore / totalStudents).toFixed(2) : 0;

  sumStudentEl.innerText = `Thống kê: ${totalStudents} sinh viên`;
  avgEl.innerText = `Điểm trung bình: ${averageScore}`;
}

/**
 * Hàm validate dữ liệu nhập
 */
function validateInput() {
  const name = nameInput.value.trim();
  const score = Number(scoreInput.value);

  if (name === "") {
    alert("Vui lòng nhập họ tên.");
    nameInput.focus();
    return false;
  }

  if (scoreInput.value === "" || isNaN(score) || score < 0 || score > 10) {
    alert("Vui lòng nhập điểm hợp lệ (số từ 0–10).");
    scoreInput.focus();
    return false;
  }

  return true;
}

/**
 * Hàm thêm sinh viên mới
 */
function addStudent() {
  if (validateInput()) {
    const name = nameInput.value.trim();
    const score = Number(scoreInput.value);

    students.push({ id: nextId++, name, score });
    searchInput.value = ""; // Xóa bộ lọc tìm kiếm
    filterStudents(); // Refresh danh sách hiển thị
    renderTable();

    // Xóa trắng input và focus vào ô họ tên
    nameInput.value = "";
    scoreInput.value = "";
    nameInput.focus();
  }
}

/**
 * Hàm xóa sinh viên
 */
function deleteStudent(studentId) {
  // Tìm và xóa sinh viên từ mảng gốc
  const index = students.findIndex((s) => s.id === studentId);
  if (index > -1) {
    students.splice(index, 1);
    filterStudents(); // Refresh danh sách hiển thị
    renderTable();
  }
}

// ========== Event Listeners ==========

/**
 * Hàm tìm kiếm sinh viên (realtime)
 */
function filterStudents() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  if (searchTerm === "") {
    // Nếu không tìm kiếm, hiển thị tất cả
    filteredStudents = [...students];
  } else {
    // Lọc theo tên (không phân biệt hoa thường)
    filteredStudents = students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm),
    );
  }

  renderTable();
}

// Bấm nút Thêm
addButton.addEventListener("click", addStudent);

// Nhấn Enter ở ô Điểm
scoreInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addStudent();
  }
});

// Event Delegation trên tbody để xử lý sự kiện xóa
tbody.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-del")) {
    const studentId = Number(event.target.getAttribute("data-student-id"));
    deleteStudent(studentId);
  }
});

// Event listener cho ô tìm kiếm (realtime)
searchInput.addEventListener("input", filterStudents);

// Render bảng lần đầu khi trang tải xong
renderTable();
