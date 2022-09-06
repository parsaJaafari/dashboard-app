import { Query, Builder, Utils as QbUtils } from "react-awesome-query-builder";

import {
  JsonGroup,
  Config,
  ImmutableTree,
  BuilderProps,
} from "react-awesome-query-builder";

import AntdConfig from "react-awesome-query-builder/lib/config/antd";
import { mapAwesomeFilter } from "../utils/mapper";
import { IPost } from "interfaces";

import "react-awesome-query-builder/lib/css/styles.css";
import { useCallback, useMemo, useState } from "react";
import { useList } from "@pankod/refine-core";

const InitialConfig = AntdConfig;

// You can load query value from your backend storage (for saving see `Query.onChange()`)
const queryValue: JsonGroup = { id: QbUtils.uuid(), type: "group" };

export const ReactAwesomeBuilder: any = () => {
  const { data: categoryData } = useList({ resource: "categories" });

  const categoriesList = categoryData?.data.map((category) => ({
    title: category.name,
    value: category.id,
  }));

  const config = useMemo<any>(() => {
    return {
      ...InitialConfig,
      fields: {
        price: {
          label: "Price",
          type: "number",
          valueSources: ["value"],
          fieldSettings: {
            min: 10,
            max: 100,
          },
          preferWidgets: ["slider", "rangeslider"],
        },
        categories: {
          label: "Categories",
          type: "multiselect",
          valueSources: ["value"],
          fieldSettings: {
            listValues: categoriesList,
          },
        },
        is_promotion: {
          label: "Promo?",
          type: "boolean",
          operators: ["equal"],
          valueSources: ["value"],
        },
      },
    };
  }, []);

  const [state, setState] = useState<any>({
    tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), config),
    config: config,
  });

  const onChange = useCallback(
    (immutableTree: ImmutableTree, config: Config) => {
      // `jsonTree` can be saved to backend, and later loaded to `queryValue`
      setState((prevState: any) => ({
        ...prevState,
        tree: immutableTree,
        config: config,
      }));

      const jsonTree = QbUtils.getTree(immutableTree);

      mapAwesomeFilter(jsonTree);
      // `jsonTree` can be saved to backend, and later loaded to `queryValue`
    },
    []
  );

  const renderBuilder = useCallback(
    (props: BuilderProps) => (
      <div className="query-builder-container" style={{ padding: "10px" }}>
        <div className="query-builder qb-lite">
          <Builder {...props} />
        </div>
      </div>
    ),
    []
  );

  return (
    <div>
      <Query
        {...config}
        value={state.tree}
        onChange={onChange}
        renderBuilder={renderBuilder}
      />
      <div className="query-builder-result">
        <div>
          Query string:{" "}
          <pre>
            {JSON.stringify(QbUtils.queryString(state.tree, state.config))}
          </pre>
        </div>
        <div>
          MongoDb query:{" "}
          <pre>
            {JSON.stringify(QbUtils.mongodbFormat(state.tree, state.config))}
          </pre>
        </div>
        <div>
          SQL where:{" "}
          <pre>
            {JSON.stringify(QbUtils.sqlFormat(state.tree, state.config))}
          </pre>
        </div>
        <div>
          JsonLogic:{" "}
          <pre>
            {JSON.stringify(QbUtils.jsonLogicFormat(state.tree, state.config))}
          </pre>
        </div>
      </div>
    </div>
  );
};
