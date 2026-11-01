import React from "react";
import { Card, Button, Typography, Rate } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Meta } = Card;
const { Text } = Typography;

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <Card
      hoverable
      cover={
        <img
          alt={product?.name}
          src={product?.image || "https://via.placeholder.com/300"}
          style={{ height: 200, objectFit: "cover" }}
        />
      }
    >
      <Meta
        title={product?.name}
        description={
          <div>
            <Text strong style={{ color: "#d48806" }}>
              {product?.price?.toLocaleString("vi-VN")} đ
            </Text>

            <div style={{ marginTop: 8 }}>
              <Rate disabled defaultValue={product?.rating || 4} />
            </div>
          </div>
        }
      />

      <Button
        type="primary"
        icon={<ShoppingCartOutlined />}
        style={{ marginTop: 12, width: "100%" }}
        onClick={() => onAddToCart?.(product)}
      >
        Thêm vào giỏ
      </Button>
    </Card>
  );
};

export default ProductCard;