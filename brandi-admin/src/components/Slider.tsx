import React from "react";
import { useTitle } from "@pankod/refine-core";
import { Menu, useMenu, Button } from "@pankod/refine-antd";
import routerProvider from "@pankod/refine-react-router-v6";
import { useLogout } from "@pankod/refine-core";

const { Link } = routerProvider;

export const Slider: React.FC = () => {
  const Title = useTitle();
  const { menuItems, selectedKey } = useMenu();
  const { mutate: logout } = useLogout();

  return (
    <>
      {Title && <Title collapsed={false} />}
      <Menu selectedKeys={[selectedKey]} mode="horizontal">
        {menuItems.map(({ icon, route, label }) => (
          <Menu.Item key={route} icon={icon}>
            <Link to={route ?? ""}>{label}</Link>
          </Menu.Item>
        ))}
        <Menu.Item style={{ marginLeft: "auto" }}>
          <Button onClick={() => logout()}>Logout</Button>
        </Menu.Item>
      </Menu>
    </>
  );
};
