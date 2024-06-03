// Sidebar.tsx
import Layout from "../Style/layout/index";
import Menu from "../Style/menu/index";
import { MessageOutlined } from '@ant-design/icons'; // Import the MessageOutlined icon

const { Sider } = Layout;

const Sidebar = ({ menuItems, selectChannel }: { menuItems: string[]; selectChannel: (channelId: string) => void; }) => (
  <Sider width={200} className="site-layout-background">
    <Menu
      mode="inline"
      defaultSelectedKeys={['1']}
      style={{ height: '100%', borderRight: 0 }}
    >
    {menuItems.map((item: string, index: number) => (
        <Menu.Item key={index} icon={<MessageOutlined />} onClick={() => selectChannel(item)}> {/* Use the MessageOutlined icon */}
          {item}
        </Menu.Item>
      ))}
    </Menu>
  </Sider>
);

export default Sidebar;