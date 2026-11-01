import { Empty, Button } from "antd";

export default function Cart() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Shopping Cart</h1>
      <Empty description="Cart is empty" />
      <Button type="primary" style={{ marginTop: "20px" }}>Continue Shopping</Button>
    </div>
  );
}
