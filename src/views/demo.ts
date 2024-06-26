export const initData = {
  nodeId: "10001",
  nodeName: "规则名称",
  nodeType: "BEGIN",
  extId: 10000001,
  ruleDescription: null,
  content: {
    id: 10000001,
    name: "BEGIN",
    ruleDescription: "联系人调用规则",
    entityId: 101,
    entityName: "联系人",
  },
  children: [
    {
      nodeId: "20001",
      nodeName: "触发器",
      nodeType: "TRIGGER",
      extId: 20000001,
      ruleDescription: null,
      content: {
        id: 2000000000001,
        name: "TRIGGER",
        triggerType: "INVOKED_PATTERN",
        triggerDateField: null,
        executeOpportunity: null,
        timeDiff: null,
        loopExecution: null,
        loopIntervals: null,
        dateBegin: null,
        dateEndOn: null,
        dateEnd: null,
        timerConditions: null,
        fromOperatorType: null,
        conditionMetTrigger: true,
        conditionConfigOption: "CONDITION_FOCUS",
        conditions: {
          operator: "AND",
          groupCondition: [
            {
              entity: 101,
              field: "phone",
              operator: "EQUALS",
              valueType: "FIXED_VALUE",
              value: ["18888888888"],
              referField: null,
            },
          ],
          group: null,
        },
        expression: null,
      },
      children: [
        {
          nodeId: "30001",
          name: "CONDITION",
          nodeName: "条件",
          nodeType: "CONDITION",
          extId: 30000001,
          ruleDescription: null,
          content: {
            id: 3000000000001,
            name: "CONDITION",
            conditionConfigOption: "CONDITION_FOCUS",
            conditions: {
              operator: "AND",
              groupCondition: [
                {
                  entity: 101,
                  field: "age",
                  operator: "GREAT_EQUALS",
                  valueType: "FIXED_VALUE",
                  value: ["10"],
                  referField: null,
                },
                {
                  entity: 101,
                  field: "phone",
                  operator: "IN",
                  valueType: "FIELD_REFER_VALUE",
                  value: null,
                  referField: {
                    referEntity: 1010,
                    apiKeyType: "relation",
                    fieldApiKey: "leader",
                    foreignKey: "leader",
                    foreignFieldApiKey: "phone",
                  },
                },
                {
                  entity: 101,
                  field: "phone",
                  operator: "IN",
                  valueType: "FIELD_REFER_VALUE",
                  value: null,
                  referField: {
                    referEntity: 102,
                    apiKeyType: "details",
                    fieldApiKey: "contactList",
                    foreignKey: "customer",
                    foreignFieldApiKey: "phone",
                  },
                },
              ],
              group: null,
            },
            expression: null,
          },
          children: [
            {
              nodeId: "40001",
              nodeName: "执行",
              nodeType: "ACTION",
              extId: 40000001,
              ruleDescription: null,
              content: {
                id: null,
                name: "ACTION",
                executeType: "RETURN_DATA",
                startAccount: "1166114247636017152",
                returnType: "VALUE_RETURN",
                dataType: "FIXED_VALUE",
                dataValue: "返回值99999",
                expression: null,
              },
              children: [
                {
                  nodeId: "50001",
                  nodeName: "结束1",
                  nodeType: "END",
                  extId: 50000001,
                  ruleDescription: null,
                  content: null,
                  children: [],
                },
              ],
            },
          ],
        },
        {
          nodeId: "30002",
          nodeName: "条件2",
          nodeType: "CONDITION",
          extId: 30000002,
          ruleDescription: null,
          content: {
            id: 3000000000001,
            name: "CONDITION",
            conditionConfigOption: "CONDITION_FOCUS",
            conditions: {
              operator: "AND",
              groupCondition: [
                {
                  entity: 101,
                  field: "marriageStatus",
                  operator: "IN",
                  valueType: "FIXED_VALUE",
                  value: ["1", "2", "3"],
                  referField: null,
                },
              ],
              group: null,
            },
            expression: null,
          },
          children: [
            {
              nodeId: "40002",
              nodeName: "执行2",
              nodeType: "ACTION",
              extId: 40000002,
              ruleDescription: null,
              content: {
                id: null,
                name: "ACTION",
                executeType: "WORK_FLOW",
                startAccount: "1166114247636017152",
                returnType: null,
                dataType: null,
                dataValue: null,
                expression: null,
              },
              children: [
                {
                  nodeId: "50002",
                  nodeName: "结束2",
                  nodeType: "END",
                  extId: 50000002,
                  ruleDescription: null,
                  content: null,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
