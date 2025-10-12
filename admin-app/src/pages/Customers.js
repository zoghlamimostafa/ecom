import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Button, Space, Popconfirm, message, Input, Select, Card, Tag } from "antd";
import { SearchOutlined, UserOutlined, BlockOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUsers, blockUser, unblockUser, deleteUser } from "../features/cutomers/customerSlice";

const { Search } = Input;
const { Option } = Select;

const Customers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      console.log('Deleting user with ID:', userId); // Debug log
      const result = await dispatch(deleteUser(userId));
      
      if (deleteUser.fulfilled.match(result)) {
        message.success('User deleted successfully');
        // Ne pas faire dispatch(getUsers()) car le state Redux est déjà mis à jour
      } else {
        throw new Error(result.payload?.message || 'Deletion failed');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      message.error('Failed to delete user: ' + (error.message || error));
      // Rafraîchir en cas d'erreur pour synchroniser avec le serveur
      dispatch(getUsers());
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
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/edit-user/${record.userId}`)}
          >
            Edit
          </Button>
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
    key: customer.id || `customer-${index}`, // Use customer ID as key - Fixed: use customer.id instead of customer._id
    userId: customer.id, // Fixed: use customer.id instead of customer._id
    name: `${customer.firstname} ${customer.lastname}`,
    email: customer.email,
    mobile: customer.mobile,
    isBlocked: customer.isBlocked,
  }));

  if (isError) {
    // Sécuriser l'affichage du message d'erreur
    let safeErrorMessage = "Failed to load customers data";
    if (errorMessage) {
      if (typeof errorMessage === 'string') {
        safeErrorMessage = errorMessage;
      } else if (typeof errorMessage === 'object' && errorMessage.message) {
        safeErrorMessage = errorMessage.message;
      } else if (typeof errorMessage === 'object') {
        safeErrorMessage = JSON.stringify(errorMessage);
      }
    }
    
    return (
      <div>
        <h3 className="mb-4 title">Customers</h3>
        <Alert
          message="Error"
          description={safeErrorMessage}
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