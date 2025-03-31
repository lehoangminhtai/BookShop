const SidebarSkeleton = () => {
  // Tạo 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-100 border-end d-flex flex-column">
      {/* Header */}
      <div className="border-bottom w-100 p-3 d-flex align-items-center">
      <i className="fa fa-users" style={{ fontSize: "24px" }}></i>
        <span className="fw-medium d-none d-lg-block">Contacts</span>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-auto w-100 py-3">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-100 p-3 d-flex align-items-center">
            {/* Avatar skeleton */}
            <div className="position-relative mx-auto mx-lg-0">
              <div className="rounded-circle bg-secondary placeholder-glow" style={{ width: "48px", height: "48px" }} />
            </div>

            {/* User info skeleton - chỉ hiển thị trên màn hình lớn */}
            <div className="d-none d-lg-block text-start flex-grow-1 ms-3">
              <div className="bg-secondary placeholder-glow rounded mb-2" style={{ height: "16px", width: "120px" }} />
              <div className="bg-secondary placeholder-glow rounded" style={{ height: "12px", width: "80px" }} />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;