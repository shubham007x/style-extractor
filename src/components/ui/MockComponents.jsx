import React from "react";
import { useSelector } from "react-redux";

const MockComponents = () => {
  const { editedStyles } = useSelector((state) => state.styles);

  const getStyle = (path) => {
    return path.split(".").reduce((obj, key) => obj?.[key], editedStyles);
  };

  const buttonStyle = {
    backgroundColor: getStyle("colors.primary") || "#3b82f6",
    color: getStyle("colors.text.primary") || "#ffffff",
    fontFamily:
      getStyle("typography.fontFamily.primary") || "Inter, sans-serif",
    fontSize: getStyle("typography.fontSize.base") || "16px",
    fontWeight: getStyle("typography.fontWeight.medium") || "500",
    padding: `${getStyle("spacing.padding.md") || "12px"} ${
      getStyle("spacing.padding.lg") || "24px"
    }`,
    borderRadius: getStyle("borderRadius.medium") || "12px",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  };

  const cardStyle = {
    backgroundColor: getStyle("colors.surface") || "#ffffff",
    color: getStyle("colors.text.primary") || "#111827",
    fontFamily:
      getStyle("typography.fontFamily.primary") || "Inter, sans-serif",
    padding: getStyle("spacing.padding.xl") || "32px",
    borderRadius: getStyle("borderRadius.large") || "16px",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    border: `1px solid ${getStyle("colors.border") || "#f3f4f6"}`,
    maxWidth: "500px",
  };

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
          <span className="text-white text-lg">👁️</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Live Style Preview
          </h3>
          <p className="text-gray-600">See your extracted styles in action</p>
        </div>
      </div>

      <div className="space-y-10">
        {/* Enhanced Buttons Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <span className="mr-3 text-2xl">🔘</span>
            Button Components
          </h4>
          <div className="flex flex-wrap gap-4">
            <button
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 25px -8px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0px)";
                e.target.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
              }}
            >
              Primary Action
            </button>
            <button
              style={{
                ...buttonStyle,
                backgroundColor: getStyle("colors.secondary") || "#6366f1",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 8px 25px -8px rgba(99, 102, 241, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0px)";
                e.target.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
              }}
            >
              Secondary Action
            </button>
            <button
              style={{
                ...buttonStyle,
                backgroundColor: "transparent",
                color: getStyle("colors.primary") || "#3b82f6",
                border: `2px solid ${getStyle("colors.primary") || "#3b82f6"}`,
                boxShadow: "none",
              }}
            >
              Outline Button
            </button>
          </div>
        </div>

        {/* Enhanced Card Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <span className="mr-3 text-2xl">🃏</span>
            Card Component
          </h4>
          <div style={cardStyle}>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl">⭐</span>
              </div>
              <div>
                <h5
                  style={{
                    fontSize: getStyle("typography.fontSize.xl") || "24px",
                    fontWeight: getStyle("typography.fontWeight.bold") || "700",
                    margin: "0 0 4px 0",
                  }}
                >
                  Premium Feature Card
                </h5>
                <p
                  style={{
                    color: getStyle("colors.text.secondary") || "#6b7280",
                    fontSize: getStyle("typography.fontSize.sm") || "14px",
                    margin: "0",
                  }}
                >
                  Extracted from your design
                </p>
              </div>
            </div>

            <p
              style={{
                color: getStyle("colors.text.primary") || "#374151",
                fontSize: getStyle("typography.fontSize.base") || "16px",
                lineHeight: getStyle("typography.lineHeight.normal") || "1.6",
                margin: "0 0 24px 0",
              }}
            >
              This card component demonstrates the extracted design tokens
              including colors, typography, spacing, and border radius. The
              styling adapts automatically based on your uploaded design.
            </p>

            <div className="flex items-center justify-between">
              <button
                style={{
                  ...buttonStyle,
                  fontSize: "14px",
                  padding: "10px 20px",
                }}
              >
                Learn More
              </button>
              <div className="flex space-x-2">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                  ★
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Form Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <span className="mr-3 text-2xl">📝</span>
            Form Elements
          </h4>
          <div className="max-w-md space-y-6">
            {[
              {
                label: "Full Name",
                placeholder: "Enter your full name",
                type: "text",
              },
              {
                label: "Email Address",
                placeholder: "you@example.com",
                type: "email",
              },
              {
                label: "Phone Number",
                placeholder: "+1 (555) 123-4567",
                type: "tel",
              },
            ].map((field, index) => (
              <div key={index}>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    fontSize: "16px",
                    border: `2px solid ${
                      getStyle("colors.border") || "#e5e7eb"
                    }`,
                    borderRadius: "12px",
                    backgroundColor: "#ffffff",
                    outline: "none",
                    transition: "all 0.2s ease-in-out",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor =
                      getStyle("colors.primary") || "#3b82f6";
                    e.target.style.boxShadow = `0 0 0 3px ${
                      getStyle("colors.primary") || "#3b82f6"
                    }20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor =
                      getStyle("colors.border") || "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            ))}

            <button
              style={{
                ...buttonStyle,
                width: "100%",
                padding: "16px",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Submit Form
            </button>
          </div>
        </div>

        {/* Enhanced Color Palette */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <span className="mr-3 text-2xl">🎨</span>
            Extracted Color Palette
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {editedStyles.colors &&
              Object.entries(editedStyles.colors).map(([key, value]) => {
                if (typeof value === "string" && value.startsWith("#")) {
                  return (
                    <div key={key} className="text-center group">
                      <div
                        className="w-20 h-20 rounded-2xl shadow-lg border-4 border-white mb-3 mx-auto transition-transform duration-200 group-hover:scale-110"
                        style={{
                          backgroundColor: value,
                          boxShadow: `0 4px 20px ${value}40`,
                        }}
                      />
                      <p className="text-sm font-semibold text-gray-800 capitalize">
                        {key}
                      </p>
                      <p className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded-lg mt-1 inline-block">
                        {value.toUpperCase()}
                      </p>
                    </div>
                  );
                }
                return null;
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockComponents;
