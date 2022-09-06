import { useState } from "react";
import { IResourceComponentsProps } from "@pankod/refine-core";

import {
  List,
  Table,
  useTable,
  getDefaultSortOrder,
  FilterDropdown,
  Select,
  useSelect,
  DateField,
  Space,
  EditButton,
  DeleteButton,
  ImageField,
  Form,
  Radio,
  Tag,
  TagField,
} from "@pankod/refine-antd";

import { ReactAwesomeBuilder } from "components/ReactAwesomeBuilder";
import { IPost } from "interfaces";

export const HashtagList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps, sorter } = useTable<IPost>({
    resource: "hashtag-analyses",

    metaData: {
      populate: ["categories", "strategies"],
    },
  });

  return (
    <List>
      <ReactAwesomeBuilder />
      <br />
      <Table
        {...tableProps}
        rowKey="id"
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: true,
        }}
      >
        <Table.Column
          dataIndex="id"
          key="id"
          title="ID"
          defaultSortOrder={getDefaultSortOrder("id", sorter)}
          sorter={{ multiple: 3 }}
        />
        <Table.Column
          dataIndex="hashtag"
          key="title"
          title="Title"
          defaultSortOrder={getDefaultSortOrder("title", sorter)}
          sorter={{ multiple: 2 }}
        />

        <Table.Column
          dataIndex="categories"
          title="Categories"
          key="id"
          render={(value: any) =>
            value.map((item: any) => <TagField value={item.name} />)
          }
        />

        <Table.Column<{ id: string }>
          title="Actions"
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
