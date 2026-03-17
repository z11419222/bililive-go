import React from 'react';
import { HashRouter as Router, Link } from 'react-router-dom';
import { Layout, Menu, Button, Drawer } from 'antd';
import {
    MonitorOutlined,
    UnorderedListOutlined,
    DashboardOutlined,
    SettingOutlined,
    FolderOutlined,
    ToolOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LineChartOutlined,
    CloudUploadOutlined,
    MenuOutlined
} from '@ant-design/icons';
import './layout.css';

const { Header, Content, Sider } = Layout;

interface Props {
    children?: React.ReactNode;
}

interface State {
    collapsed: boolean;
    drawerVisible: boolean;
}

// localStorage key 用于保存侧边栏收起状态
const SIDER_COLLAPSED_KEY = 'siderCollapsed';

class RootLayout extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        // 从 localStorage 读取收起状态
        let collapsed = false;
        try {
            const saved = localStorage.getItem(SIDER_COLLAPSED_KEY);
            if (saved !== null) {
                collapsed = saved === 'true';
            }
        } catch (e) {
            console.error('读取侧边栏状态失败:', e);
        }
        this.state = { collapsed, drawerVisible: false };
    }

    toggleCollapsed = () => {
        const collapsed = !this.state.collapsed;
        this.setState({ collapsed });
        // 保存到 localStorage
        try {
            localStorage.setItem(SIDER_COLLAPSED_KEY, String(collapsed));
        } catch (e) {
            console.error('保存侧边栏状态失败:', e);
        }
    };

    toggleDrawer = () => {
        this.setState({ drawerVisible: !this.state.drawerVisible });
    };

    closeDrawer = () => {
        this.setState({ drawerVisible: false });
    };

    renderMenu = (isDrawer = false) => {
        const { collapsed } = this.state;
        return (
            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                inlineCollapsed={!isDrawer && collapsed}
                style={{ borderRight: 0 }}
                onClick={isDrawer ? this.closeDrawer : undefined}
                items={[
                    {
                        key: '1',
                        icon: <MonitorOutlined />,
                        label: <Link to="/">监控列表</Link>,
                    },
                    {
                        key: '2',
                        icon: <DashboardOutlined />,
                        label: <Link to="/liveInfo">系统状态</Link>,
                    },
                    {
                        key: '3',
                        icon: <SettingOutlined />,
                        label: <Link to="/configInfo">设置</Link>,
                    },
                    {
                        key: '4',
                        icon: <FolderOutlined />,
                        label: <Link to="/fileList">文件</Link>,
                    },
                    {
                        key: '5',
                        icon: <ToolOutlined />,
                        label: <a href="/tools/" target="_blank" rel="noopener noreferrer">工具</a>,
                    },
                    {
                        key: 'tasks',
                        icon: <UnorderedListOutlined />,
                        label: <Link to="/tasks">任务队列</Link>,
                    },
                    {
                        key: 'iostats',
                        icon: <LineChartOutlined />,
                        label: <Link to="/iostats">IO 统计</Link>,
                    },
                    {
                        key: 'update',
                        icon: <CloudUploadOutlined />,
                        label: <Link to="/update">更新</Link>,
                    }
                ]}
            />
        );
    };

    render() {
        const { collapsed, drawerVisible } = this.state;
        return (
            <Router>
                <Layout className="all-layout">
                    <Header className="header small-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '15px' }}>
                        <h3 className="logo-text">Bililive-go</h3>
                        <Button
                            className="mobile-menu-btn"
                            type="text"
                            icon={<MenuOutlined style={{ color: '#fff', fontSize: '20px' }} />}
                            onClick={this.toggleDrawer}
                        />
                    </Header>
                    <Drawer
                        title="Bililive-go"
                        placement="left"
                        closable={false}
                        onClose={this.closeDrawer}
                        open={drawerVisible}
                        bodyStyle={{ padding: 0 }}
                        width={240}
                    >
                        {this.renderMenu(true)}
                    </Drawer>
                    <Layout>
                        <Sider
                            className="side-bar"
                            width={200}
                            collapsedWidth={60}
                            style={{ background: '#fff' }}
                            trigger={null}
                            collapsible
                            collapsed={collapsed}
                        >
                            {/* 折叠按钮在顶部，与菜单图标对齐 */}
                            <div style={{
                                padding: '12px 0',
                                borderBottom: '1px solid #f0f0f0',
                                width: '100%'
                            }}>
                                <Button
                                    type="text"
                                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                    onClick={this.toggleCollapsed}
                                    style={{
                                        fontSize: 16,
                                        width: '100%',
                                        textAlign: 'left',
                                        paddingLeft: collapsed ? 20 : 24,
                                        height: 40
                                    }}
                                >
                                    {!collapsed && '收起菜单'}
                                </Button>
                            </div>
                            {this.renderMenu(false)}
                        </Sider>
                        <Layout className="content-padding">
                            <Content
                                className="inside-content-padding"
                                style={{
                                    background: '#fff',
                                    margin: 0,
                                    minHeight: 280,
                                    overflow: "auto",
                                }}>
                                {this.props.children}
                            </Content>
                        </Layout>
                    </Layout>
                </Layout>
            </Router>
        )
    }
}

export default RootLayout;
