// src/components/Header.tsx
import { useState } from "react";
import { Layout, Menu, Input, Badge, Button, Avatar, Row, Col, Dropdown, message } from "antd";
import type { MenuProps } from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
  ShoppingOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart(); // Sử dụng cartCount từ CartContext
  const { user, isAuthenticated, logout } = useAuth();
  const [search, setSearch] = useState("");

  const menuItems = [
    { key: "home", label: <Link to="/">Trang chủ</Link> },
    { key: "about", label: <Link to="/about">Giới thiệu</Link> },
    { key: "collection", label: <Link to="/collection">Sản phẩm</Link> },
    { key: "contact", label: <Link to="/contact">Liên hệ</Link> },
  ];

  // Menu dropdown cho avatar
  const userMenuItems: MenuProps['items'] = isAuthenticated
    ? [
        {
          key: 'profile',
          icon: <UserOutlined />,
          label: 'Thông tin cá nhân',
          onClick: () => navigate('/profile'),
        },
        {
          key: 'orders',
          icon: <ShoppingOutlined />,
          label: 'Đơn hàng của tôi',
          onClick: () => navigate('/orders'),
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: 'Cài đặt',
          onClick: () => navigate('/settings'),
        },
        {
          type: 'divider' as const,
        },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'Đăng xuất',
          danger: true,
          onClick: () => {
            logout();
            message.success('Đã đăng xuất thành công!');
            navigate('/');
          },
        },
      ]
    : [
        {
          key: 'login',
          icon: <UserSwitchOutlined />,
          label: 'Đăng nhập / Đăng ký',
          onClick: () => navigate('/auth'),
        },
      ];

  return (
    <AntHeader
      className="shadow-sm fixed w-full z-50"
      style={{
        background: "#9FCBAD",
        padding: "0 40px",
        height: "72px",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <Row align="middle" className="h-full" justify="space-between">
        {/* Logo */}
        <Col flex="none" style={{ paddingLeft: "220px" }}>
          <Link to="/">
            <img
              src="/logo.png"
              alt="H2DOR Logo"
              style={{
                height: "72px",
                width: "auto",
                objectFit: "contain",
              }}
            />
          </Link>
        </Col>

        {/* Menu */}
        <Col flex="auto">
          <Menu
            mode="horizontal"
            items={menuItems}
            style={{
              display: "flex",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              fontSize: "15px",
              fontWeight: 500,
              lineHeight: "72px",
            }}
            className="header-menu"
          />
        </Col>

        {/* Right */}
        <Col flex="none">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {/* Search */}
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={() =>
                navigate(`/products?search=${search}`)
              }
              style={{
                width: 280,
                borderRadius: 20,
              }}
            />

            {/* Cart */}
            <Badge
              count={cartCount}
              offset={[-5, 5]}
              style={{
                backgroundColor: "#b8860b",
              }}
            >
              <Button
                type="text"
                icon={
                  <ShoppingCartOutlined
                    style={{
                      fontSize: 24,
                      color: "#333",
                    }}
                  />
                }
                onClick={() => navigate("/checkout")}
              />
            </Badge>

            {/* User Avatar with Dropdown */}
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
              trigger={['click']}
            >
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: isAuthenticated ? "#b8860b" : "#8b5a2b",
                    width: 44,
                    height: 44,
                    border: isAuthenticated ? '2px solid #b8860b' : 'none',
                  }}
                />
                {isAuthenticated && user && (
                  <span style={{ 
                    color: '#333', 
                    fontWeight: 500,
                    fontSize: 14,
                    maxWidth: 100,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {user.name}
                  </span>
                )}
              </div>
            </Dropdown>
          </div>
        </Col>
      </Row>

      <style>{`
        .header-menu .ant-menu-item{
          padding:0 20px!important;
          color:#333!important;
        }

        .header-menu .ant-menu-item:hover{
          color:#b8860b!important;
        }

        .header-menu .ant-menu-item-selected{
          color:#b8860b!important;
        }

        .header-menu .ant-menu-item-selected::after,
        .header-menu .ant-menu-item:hover::after{
          border-bottom-color:#b8860b!important;
        }

        .ant-dropdown-menu-item:hover {
          background-color: #f5f0eb !important;
        }
        .ant-dropdown-menu-item-danger:hover {
          background-color: #fff1f0 !important;
        }
      `}</style>
    </AntHeader>
  );
};

export default Header;