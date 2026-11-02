import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Card, Empty, Form, Input, List, Rate, Space, Spin, Typography, message } from 'antd';
import { createLocationReview, getLocationReviews } from '../../services/locationReviews';
import type { CreateLocationReview, LocationReview, LocationReviewSummary } from '../../services/locationReviews';

const { Text, Title } = Typography;
const { TextArea } = Input;

interface LocationReviewsProps {
  locationId: string;
  locationName: string;
}

const LocationReviews = ({ locationId, locationName }: LocationReviewsProps) => {
  const [form] = Form.useForm<CreateLocationReview>();
  const [summary, setSummary] = useState<LocationReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const { data } = await getLocationReviews(locationId);
      setSummary(data);
    } catch (error) {
      console.error('Không thể tải đánh giá địa điểm:', error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [locationId]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const handleSubmit = async (values: CreateLocationReview) => {
    setSubmitting(true);
    try {
      await createLocationReview(locationId, {
        name: values.name.trim(),
        rating: values.rating,
        comment: values.comment.trim(),
      });
      form.resetFields();
      message.success('Cảm ơn bạn đã chia sẻ đánh giá!');
      await loadReviews();
    } catch (error) {
      console.error('Không thể gửi đánh giá địa điểm:', error);
      message.error('Chưa thể gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card style={{ marginTop: 24, borderRadius: 12 }}>
      <Title level={3} style={{ marginTop: 0 }}>Đánh giá {locationName}</Title>
      {summary && (
        <Space align="center" style={{ marginBottom: 20 }}>
          <Rate disabled allowHalf value={summary.averageRating} />
          <Text strong>{summary.averageRating.toFixed(1)} / 5</Text>
          <Text type="secondary">({summary.totalReviews} đánh giá)</Text>
        </Space>
      )}

      <Form<CreateLocationReview>
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ rating: 5 }}
      >
        <Form.Item
          label="Tên của bạn"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên của bạn' },
            { min: 2, max: 80, message: 'Tên phải từ 2 đến 80 ký tự' },
          ]}
        >
          <Input maxLength={80} placeholder="Nhập tên hiển thị" />
        </Form.Item>
        <Form.Item
          label="Mức độ hài lòng"
          name="rating"
          rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}
        >
          <Rate />
        </Form.Item>
        <Form.Item
          label="Nhận xét"
          name="comment"
          rules={[
            { required: true, message: 'Vui lòng nhập nhận xét' },
            { min: 5, max: 1000, message: 'Nhận xét phải từ 5 đến 1000 ký tự' },
          ]}
        >
          <TextArea rows={4} maxLength={1000} showCount placeholder="Chia sẻ trải nghiệm của bạn về địa điểm..." />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={submitting}>
          Gửi đánh giá
        </Button>
      </Form>

      <Title level={4} style={{ marginTop: 32 }}>Nhận xét từ khách hàng</Title>
      {loadError ? (
        <Alert
          type="error"
          showIcon
          message="Không tải được đánh giá"
          action={<Button size="small" onClick={() => void loadReviews()}>Thử lại</Button>}
        />
      ) : loading ? (
        <Spin />
      ) : summary?.reviews.length ? (
        <List<LocationReview>
          dataSource={summary.reviews}
          renderItem={(review) => (
            <List.Item>
              <div style={{ width: '100%' }}>
                <Space direction="vertical" size={4}>
                  <Text strong>{review.name}</Text>
                  <Space wrap>
                    <Rate disabled value={review.rating} />
                    <Text type="secondary">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </Text>
                  </Space>
                  <Text>{review.comment}</Text>
                </Space>
              </div>
            </List.Item>
          )}
        />
      ) : (
        <Empty description="Chưa có đánh giá. Hãy là người đầu tiên chia sẻ trải nghiệm!" />
      )}
    </Card>
  );
};

export default LocationReviews;
