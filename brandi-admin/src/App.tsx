import { Refine, AuthProvider } from "@pankod/refine-core";
import {
  notificationProvider,
  Layout,
  ErrorComponent,
  AntdLayout,
} from "@pankod/refine-antd";
import { DataProvider, AuthHelper } from "@pankod/refine-strapi-v4";
import routerProvider from "@pankod/refine-react-router-v6";
import { Login } from "./pages/login";
import { Slider } from "components/Slider";

import axios from "axios";

import "@pankod/refine-antd/dist/styles.min.css";

const { Link } = routerProvider;

import { HashtagList, HashtagCreate, HashtagEdit } from "pages/hashtags";
import { UsersList } from "pages/users";
import { CategoryList, CategoryCreate, CategoryEdit } from "pages/categories";

import { TOKEN_KEY, API_URL } from "./constants";

const App: React.FC = () => {
  const axiosInstance = axios.create();
  const strapiAuthHelper = AuthHelper("/api");

  const authProvider: AuthProvider = {
    login: async ({ username, password }) => {
      const { data, status } = await strapiAuthHelper.login(username, password);
      if (status === 200) {
        localStorage.setItem(TOKEN_KEY, data.jwt);

        // set header axios instance
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.jwt}`;

        return Promise.resolve();
      }
      return Promise.reject();
    },
    logout: () => {
      localStorage.removeItem(TOKEN_KEY);
      return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        return Promise.resolve();
      }

      return Promise.reject();
    },
    getPermissions: () => Promise.resolve(),
    getUserIdentity: async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        return Promise.reject();
      }

      const { data, status } = await strapiAuthHelper.me(token);
      if (status === 200) {
        const { id, username, email } = data;
        return Promise.resolve({
          id,
          username,
          email,
        });
      }

      return Promise.reject();
    },
  };

  return (
    <Refine
      authProvider={authProvider}
      dataProvider={DataProvider("/api", axiosInstance)}
      routerProvider={routerProvider}
      Layout={({ children, Footer, OffLayoutArea }) => (
        <AntdLayout>
          <AntdLayout.Header>
            <Slider />
          </AntdLayout.Header>
          <AntdLayout.Content>
            <AntdLayout.Content>
              <div style={{ padding: 24, minHeight: 360 }}>{children}</div>
            </AntdLayout.Content>

            {Footer && <Footer />}
          </AntdLayout.Content>
          {OffLayoutArea && <OffLayoutArea />}
        </AntdLayout>
      )}
      Title={() => (
        <Link to="/" style={{ float: "left", marginRight: "10px" }}>
          <img
            src="https://avatars.githubusercontent.com/u/107786493?s=200&v=4"
            alt="Refine"
            style={{ width: "64px", height: "64px", borderRadius: "15px" }}
          />
        </Link>
      )}
      resources={[
        {
          name: "hashtag-analyses",
          list: HashtagList,
          create: HashtagCreate,
          edit: HashtagEdit,
        },
        {
          name: "categories",
          list: CategoryList,
          create: CategoryCreate,
          edit: CategoryEdit,
        },
        {
          name: "users",
          list: UsersList,
        },
      ]}
      notificationProvider={notificationProvider}
      LoginPage={Login}
      catchAll={<ErrorComponent />}
      disableTelemetry={true}
    />
  );
};

export default App;
