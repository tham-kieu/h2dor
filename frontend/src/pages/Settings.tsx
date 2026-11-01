import { Card, Form, Select, Button, Space } from "antd";

export default function Settings() {
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Card title="Settings">
        <Form layout="vertical">
          <Form.Item label="Theme">
            <Select options={[{ label: "Light", value: "light" }, { label: "Dark", value: "dark" }]} />
          </Form.Item>
          <Form.Item label="Language">
            <Select options={[{ label: "English", value: "en" }, { label: "Vietnamese", value: "vi" }]} />
          </Form.Item>
          <Space>
            <Button type="primary">Save Settings</Button>
            <Button>Reset</Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
