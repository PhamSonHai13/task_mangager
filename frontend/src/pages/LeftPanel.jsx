// LeftPanel.jsx — Shared left panel dùng chung cho Login & Register

const features = [
  { icon: "⚡", title: "AI Agents không giới hạn", desc: "Tự động hoá mọi quy trình với AI thông minh" },
  { icon: "📋", title: "Quản lý Sprint & Backlog", desc: "Theo dõi tiến độ từng sprint theo thời gian thực" },
  { icon: "🔗", title: "Tích hợp 1000+ ứng dụng", desc: "Kết nối toàn bộ hệ sinh thái công cụ của bạn" },
  { icon: "📊", title: "Báo cáo thông minh", desc: "Dashboard & biểu đồ cập nhật tức thì" },
  { icon: "🛡️", title: "Bảo mật cấp Enterprise", desc: "SOC2, ISO 27001 và mã hoá đầu cuối" },
  { icon: "🌍", title: "Hợp tác toàn cầu", desc: "Làm việc nhóm xuyên múi giờ không giới hạn" },
  { icon: "🤖", title: "Brain MAX AI", desc: "Tóm tắt, viết và phân tích tự động" },
  { icon: "📁", title: "Quản lý tài liệu", desc: "Wiki, Docs và Knowledge Base tập trung" },
];

const logos = ["Slack", "GitHub", "Figma", "Notion", "Zoom", "Salesforce", "HubSpot", "Stripe"];

function MarqueeRow({ items, reverse = false, speed = 30 }) {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div
        style={{
          display: "flex",
          gap: 12,
          width: "max-content",
          animation: `${reverse ? "marqueeR" : "marquee"} ${speed}s linear infinite`,
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 14,
              padding: "14px 20px",
              minWidth: 240,
              backdropFilter: "blur(8px)",
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{item.title}</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11.5, lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LogoRow() {
  const doubled = [...logos, ...logos];
  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div
        style={{
          display: "flex",
          gap: 16,
          width: "max-content",
          animation: "marquee 20s linear infinite",
          alignItems: "center",
        }}
      >
        {doubled.map((l, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "8px 18px",
              color: "rgba(255,255,255,0.6)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.5,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

const LeftPanel = () => {
  return (
    <div
      style={{
        width: "50vw",
        minWidth: "50vw",
        flexShrink: 0,
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0052cc 0%, #0747a6 40%, #172b4d 100%)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Noise texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px",
        }}
      />

      {/* Glow blobs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "-80px",
          width: 300,
          height: 300,
          background: "radial-gradient(circle, rgba(0,150,255,0.35), transparent)",
          borderRadius: "50%",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "-60px",
          width: 250,
          height: 250,
          background: "radial-gradient(circle, rgba(100,200,255,0.2), transparent)",
          borderRadius: "50%",
          filter: "blur(50px)",
        }}
      />

      {/* Logo */}
      <div style={{ padding: "36px 40px 0", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "rgba(255,255,255,0.2)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={{ color: "white", fontWeight: 800, fontSize: 18, letterSpacing: "-0.3px" }}>WorkFlow</span>
        </div>
      </div>

      {/* Hero text */}
      <div style={{ padding: "48px 40px 40px", position: "relative", zIndex: 10 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.12)",
            borderRadius: 999,
            padding: "5px 14px",
            marginBottom: 24,
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#57d9a3",
              display: "inline-block",
              boxShadow: "0 0 8px #57d9a3",
            }}
          />
          <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 600 }}>
            Mới! AI Company Intelligence™
          </span>
        </div>

        <h1
          style={{
            color: "white",
            fontSize: 38,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: "-1px",
            margin: "0 0 16px 0",
          }}
        >
          Mọi ứng dụng.
          <br />
          Mọi đội nhóm.
          <br />
          <span style={{ color: "rgba(255,255,255,0.5)" }}>AI không giới hạn.</span>
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 15,
            lineHeight: 1.7,
            maxWidth: 340,
            margin: "0 0 32px 0",
          }}
        >
          Thay thế mọi phần mềm của bạn. Tập trung hóa toàn bộ dữ liệu. Tối đa hóa năng suất với AI thông minh.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", gap: 32 }}>
          {[["10M+", "Người dùng"], ["99.9%", "Uptime"], ["150+", "Quốc gia"]].map(([val, lab]) => (
            <div key={lab}>
              <div style={{ color: "white", fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px" }}>{val}</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 500, marginTop: 2 }}>{lab}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scrolling cards */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: 1,
          justifyContent: "flex-end",
          paddingBottom: 40,
        }}
      >
        <MarqueeRow items={features.slice(0, 5)} speed={28} />
        <MarqueeRow items={features.slice(3)} reverse speed={22} />
        <div style={{ marginTop: 8 }}>
          <LogoRow />
        </div>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, padding: "4px 40px 0", margin: 0 }}>
          Tích hợp với 1000+ ứng dụng bạn đang dùng
        </p>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeR {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default LeftPanel;