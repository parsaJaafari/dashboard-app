const filterOperator = (awesomeOperator) => {
  switch (awesomeOperator) {
    case "equal":
      return "eq";

    default:
      return awesomeOperator;
  }
};

export const mapAwesomeFilter = (filterObject) => {
  console.log(filterObject);
  const { children1, properties } = filterObject;
  const { conjunction, not } = properties;
  return [
    {
      operator: conjunction.toLowercase,
      value: children1.map((item) => {
        return {
          field: item.field,
          operator: filterOperator(item.operator),
          value: item.value,
        };
      }),
    },
    {},
  ];
};
// checking out if it is a group or rule
// determining the type and/or if it was a group
// then map the children and based on children of each group make the fields and map the operators
