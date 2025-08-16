import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Button, Space, Popconfirm, message, Input, Select, Card, Tag } from "antd";
import { SearchOutlined, UserOutlined, BlockOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, blockUser, unblockUser, deleteUser } from "../features/cutomers/customerSlice";

const { Search } = Input;
const { Option } = Select;

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Mobile",
    dataIndex: "mobile",
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (text, record) => (
      <span style={{ color: record.isBlocked ? 'red' : 'green' }}>
        {record.isBlocked ? 'Blocked' : 'Active'}
      </span>
    ),
  },
];

const Customers = () => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  
  const { customers, isLoading, isError, message: errorMessage } = useSelector((state) => state.customer);

  // Handler for blocking/unblocking user
  const handleToggleUserStatus = async (userId, isBlocked) => {
    try {
      if (isBlocked) {
        await dispatch(unblockUser(userId));
        message.success('User unblocked successfully');
      } else {
        await dispatch(blockUser(userId));
        message.success('User blocked successfully');
      }
      // Refresh the users list
      dispatch(getUsers());
    } catch (error) {
      message.error('Failed to update user status');
    }
  };

  // Handler for deleting user
  const handleDeleteUser = async (userId) => {
    try {
      await dispatch(deleteUser(userId));
      message.success('User deleted successfully');
      // Refresh the users list
      dispatch(getUsers());
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const columns = [
    {
      title: "SNo",
      dataIndex: "key",
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <Tag color={record.isBlocked ? 'red' : 'green'}>
          {record.isBlocked ? 'BLOCKED' : 'ACTIVE'}
        </Tag>
      ),
      filters: [
        {
          text: 'Active',
          value: false,
        },
        {
          text: 'Blocked',
          value: true,
        },
      ],
      onFilter: (value, record) => record.isBlocked === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type={record.isBlocked ? "primary" : "default"}
            size="small"
            icon={<BlockOutlined />}
            onClick={() => handleToggleUserStatus(record.userId, record.isBlocked)}
          >
            {record.isBlocked ? 'Unblock' : 'Block'}
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this customer?"
            onConfirm={() => handleDeleteUser(record.userId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  // Filter and search functionality
  const filteredCustomers = customers ? customers.filter(customer => {
    if (customer.role === "admin") return false;
    
    const matchesSearch = 
      `${customer.firstname} ${customer.lastname}`.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
      (customer.mobile && customer.mobile.includes(searchText));
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && !customer.isBlocked) ||
      (statusFilter === "blocked" && customer.isBlocked);
    
    return matchesSearch && matchesStatus;
  }) : [];

  const data1 = filteredCustomers.map((customer, index) => ({
    key: customer._id || `customer-${index}`, // Use customer ID as key
    userId: customer._id,
    name: `${customer.firstname} ${customer.lastname}`,
    email: customer.email,
    mobile: customer.mobile,
    isBlocked: customer.isBlocked,
  }));

  if (isError) {
    return (
      <div>
        <h3 className="mb-4 title">Customers</h3>
        <Alert
          message="Error"
          description={errorMessage || "Failed to load customers data"}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4 title">Customer Management</h3>
      
      {/* Search and Filter Controls */}
      <Card style={{ marginBottom: 16 }}>
        <Space size="middle" style={{ marginBottom: 16 }}>
          <Search
            placeholder="Search by name, email, or mobile"
            allowClear
            enterButton={<SearchOutlined />}
            size="middle"
            style={{ width: 300 }}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(value) => setSearchText(value)}
          />
          <Select
            placeholder="Filter by status"
            style={{ width: 150 }}
            value={statusFilter}
            onChange={setStatusFilter}
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active Only</Option>
            <Option value="blocked">Blocked Only</Option>
          </Select>
          <Button 
            type="primary" 
            icon={<UserOutlined />}
            onClick={() => dispatch(getUsers())}
          >
            Refresh
          </Button>
        </Space>
        <div>
          <Tag color="green">Active: {data1.filter(c => !c.isBlocked).length}</Tag>
          <Tag color="red">Blocked: {data1.filter(c => c.isBlocked).length}</Tag>
          <Tag color="blue">Total: {data1.length}</Tag>
        </div>
      </Card>

      <div>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <p style={{ marginTop: '10px' }}>Loading customers...</p>
          </div>
        ) : (
          <Table 
            columns={columns} 
            dataSource={data1} 
            rowKey="key"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            }}
            scroll={{ x: 800 }}
          />
        )}
      </div>
    </div>
  );
};

export default Customers;