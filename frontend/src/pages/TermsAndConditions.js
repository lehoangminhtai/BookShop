import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="container my-5 d-flex justify-content-center">
      <div className="col-lg-10">
        <h1 className="text-center mb-4 fw-bold">
          📘 Điều khoản và Thỏa thuận sử dụng
        </h1>

        <p>
          Chào mừng bạn đến với Website Mua Bán & Trao Đổi Sách! Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản sau đây.
        </p>

        <h5 className="mt-4">1. Chấp nhận Điều khoản</h5>
        <p>
          Bằng cách truy cập hoặc sử dụng website, bạn đồng ý bị ràng buộc bởi các điều khoản và điều kiện này. Nếu bạn không đồng ý với bất kỳ phần nào trong điều khoản, vui lòng ngừng sử dụng dịch vụ.
        </p>

        <h5 className="mt-4">2. Đăng ký và Tài khoản</h5>
        <ul>
          <li>Người dùng cần đăng ký tài khoản để đăng bài, trao đổi hoặc mua bán sách.</li>
          <li>Bạn có trách nhiệm bảo mật thông tin tài khoản của mình.</li>
          <li>Không được mạo danh, sử dụng tài khoản giả mạo hoặc tài khoản của người khác.</li>
        </ul>

        <h5 className="mt-4">3. Nội dung do người dùng đăng tải</h5>
        <p>
          Bạn <strong>chịu hoàn toàn trách nhiệm</strong> với nội dung bạn đăng tải, bao gồm mô tả sách, hình ảnh, thông tin liên hệ và các hành vi mua bán/trao đổi.
        </p>
        <p>Không được đăng tải nội dung:</p>
        <ul>
          <li>Vi phạm pháp luật.</li>
          <li>Có tính chất khiêu dâm, bạo lực, kích động thù địch.</li>
          <li>Sách vi phạm bản quyền, hàng giả, hàng không rõ nguồn gốc.</li>
          <li>Cấm đăng tải tài liệu thuộc sở hữu trí tuệ của bên thứ ba</li>
        </ul>

        <h5 className="mt-4">4. Quyền của Quản trị viên (Admin)</h5>
        <ul>
          <li>Admin có quyền chỉnh sửa, ẩn hoặc xóa bất kỳ nội dung nào được xem là vi phạm các điều khoản.</li>
          <li>Admin có quyền khóa tài khoản tạm thời hoặc vĩnh viễn nếu người dùng vi phạm nghiêm trọng hoặc tái phạm.</li>
        </ul>

        <h5 className="mt-4">5. Giao dịch và Trách nhiệm</h5>
        <ul>
          <li>
            Giao dịch giữa các người dùng diễn ra <strong>trực tiếp</strong> và <strong>ngoài phạm vi kiểm soát của website</strong>.
          </li>
          <li>
            Website <strong>không chịu trách nhiệm</strong> về:
            <ul>
              <li>Tính chính xác, trung thực của nội dung đăng.</li>
              <li>Chất lượng, tình trạng, hoặc nguồn gốc của sách.</li>
              <li>Bất kỳ tổn thất hay tranh chấp nào xảy ra trong quá trình giao dịch.</li>
            </ul>
          </li>
        </ul>

        <h5 className="mt-4">6. Bảo mật và Quyền riêng tư</h5>
        <p>
          Thông tin cá nhân của bạn được chúng tôi lưu trữ và xử lý theo{" "}
          <a href="/privacy-policy" className="text-decoration-underline text-primary">
            Chính sách Bảo mật
          </a>. Chúng tôi không bán hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ ba mà không có sự đồng ý.
        </p>

        <h5 className="mt-4">7. Thay đổi Điều khoản</h5>
        <p>
          Chúng tôi có thể cập nhật các điều khoản này bất kỳ lúc nào. Các thay đổi sẽ được thông báo trên website. Việc bạn tiếp tục sử dụng dịch vụ sau khi điều khoản thay đổi có nghĩa là bạn đồng ý với phiên bản cập nhật.
        </p>

        <h5 className="mt-4">8. Liên hệ</h5>
        <p>
          Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ chúng tôi qua: <br />
          📧 Email:{" "}
          <a href="mailto:bookshopute@gmail.com" className="text-decoration-underline text-primary">
            bookshopute@gmail.com
          </a>{" "}
          <br />
          📞 Hotline: 0326 344 084
        </p>

        <div className="border-start border-4 ps-3 bg-light fst-italic mt-4">
          Việc sử dụng website đồng nghĩa với việc bạn đã đọc, hiểu và đồng ý với toàn bộ nội dung trong điều khoản này.
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
