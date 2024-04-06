<template>
  <!-- 容器 -->
  <div
    ref="container"
    id="container"
    style="width: 600px; height: 600px; margin: 0 auto"
  ></div>
</template>

<script setup lang="tsx">
import { onMounted, ref } from "vue";
import G6 from "@antv/g6";
import { initData } from "./demo.ts";

// 收起图标路径
const COLLAPSE_ICON = function COLLAPSE_ICON(x, y, r) {
  return [
    ["M", x - r, y - r],
    ["a", r, r, 0, 1, 0, r * 2, 0],
    ["a", r, r, 0, 1, 0, -r * 2, 0],
    ["M", x + 2 - r, y - r],
    ["L", x + r - 2, y - r],
  ];
};

// 展开图标路径
const EXPAND_ICON = function EXPAND_ICON(x, y, r) {
  return [
    ["M", x - r, y - r],
    ["a", r, r, 0, 1, 0, r * 2, 0],
    ["a", r, r, 0, 1, 0, -r * 2, 0],
    ["M", x + 2 - r, y - r],
    ["L", x + r - 2, y - r],
    ["M", x, y - 2 * r + 2],
    ["L", x, y - 2],
  ];
};

// 图标映射
const ICON_MAP = {
  a: "https://gw.alipayobjects.com/mdn/rms_8fd2eb/afts/img/A*0HC-SawWYUoAAAAAAAAAAABkARQnAQ",
  b: "https://gw.alipayobjects.com/mdn/rms_8fd2eb/afts/img/A*sxK0RJ1UhNkAAAAAAAAAAABkARQnAQ",
};

// 数据
const data = initData;

let container = ref(null);

// 挂载后执行的函数
onMounted(() => {
  // 初始化数据中的 leftIcon
  G6.Util.traverseTree(data, (d) => {
    d.leftIcon = {
      style: {
        fill: "#e6fffb",
        stroke: "#e6fffb",
      },
      img: "https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*Q_FQT6nwEC8AAAAAAAAAAABkARQnAQ",
    };
    return true;
  });

  // 注册节点
  G6.registerNode(
    "icon-node",
    {
      // 绘制节点形状
      drawShape: function drawShape(cfg, group) {
        const color = cfg.error ? "#F4664A" : "#30BF78";
        const r = 2;
        const shape = group.addShape("rect", {
          attrs: {
            x: 0,
            y: 0,
            width: 100,
            height: 30,
            stroke: color,
            radius: r,
          },
          // 节点名称
          name: "main-box",
          draggable: true,
        });

        group.addShape("rect", {
          attrs: {
            x: 0,
            y: 0,
            width: 100,
            height: 10,
            fill: color,
            radius: [r, r, 0, 0],
          },
          name: "title-box",
          draggable: true,
        });

        // 左侧图标
        group.addShape("image", {
          attrs: {
            x: 4,
            y: 2,
            height: 12,
            width: 16,
            cursor: "pointer",
            img: ICON_MAP[cfg.nodeType || "app"],
          },
          name: "node-icon",
        });

        // 标题文字
        group.addShape("text", {
          attrs: {
            textBaseline: "top",
            y: 2,
            x: 24,
            lineHeight: 20,
            text: cfg.nodeName,
            fill: "#fff",
          },
          name: "title",
        });

        if (cfg.nodeLevel > 0) {
          group.addShape("marker", {
            attrs: {
              x: 184,
              y: 30,
              r: 6,
              cursor: "pointer",
              symbol: cfg.collapse ? G6.Marker.expand : G6.Marker.collapse,
              stroke: "#666",
              lineWidth: 1,
            },
            name: "collapse-icon",
          });
        }

        return shape;
      },
    },
    "single-node"
  );

  // 注册边
  G6.registerEdge("flow-line", {
    // 绘制边
    draw(cfg, group) {
      const startPoint = cfg.startPoint;
      const endPoint = cfg.endPoint;

      const { style } = cfg;
      const shape = group.addShape("path", {
        attrs: {
          stroke: style.stroke,
          endArrow: style.endArrow,
          path: [
            ["M", startPoint.x, startPoint.y],
            ["L", startPoint.x, (startPoint.y + endPoint.y) / 2],
            ["L", endPoint.x, (startPoint.y + endPoint.y) / 2],
            ["L", endPoint.x, endPoint.y],
          ],
        },
      });

      return shape;
    },
  });

  // 默认状态样式
  const defaultStateStyles = {
    hover: {
      stroke: "#1890ff",
      lineWidth: 2,
    },
  };

  // 默认节点样式
  const defaultNodeStyle = {
    fill: "#91d5ff",
    stroke: "#40a9ff",
    radius: 10,
  };

  // 默认边样式
  const defaultEdgeStyle = {
    stroke: "#A8ABB2",
    endArrow: {
      path: "M 0,0 L 8, 4 L 8, -4 Z",
      fill: "#A8ABB2",
      d: -20,
    },
  };
  // 默认布局方式
  const defaultLayout = {
    type: "compactBox",
    direction: "TB",
    getId: function getId(d) {
      return d.id;
    },
    getHeight: function getHeight() {
      return 16;
    },
    getWidth: function getWidth() {
      return 16;
    },
    getVGap: function getVGap() {
      return 40;
    },
    getHGap: function getHGap() {
      return 70;
    },
  };

  // 默认标签配置
  const defaultLabelCfg = {
    style: {
      fill: "#000",
      fontSize: 12,
    },
  };

  const container = document.getElementById("container");
  const width = container.scrollWidth;
  const height = container.scrollHeight || 500;

  // 创建缩略图
  const minimap = new G6.Minimap({
    size: [150, 100],
  });

  // 创建图形实例
  const graph = new G6.TreeGraph({
    container: "container",
    width,
    height,
    linkCenter: true,
    plugins: [minimap],
    defaultNode: {
      type: "icon-node",
      size: [120, 40],
      style: defaultNodeStyle,
      labelCfg: defaultLabelCfg,
    },
    defaultEdge: {
      type: "flow-line",
      style: defaultEdgeStyle,
    },
    nodeStateStyles: defaultStateStyles,
    edgeStateStyles: defaultStateStyles,
    layout: defaultLayout,
  });

  // 设置数据
  graph.data(data);
  // 渲染图形
  graph.render();
  // 适应视图
  graph.fitView();

  // 节点鼠标进入事件
  graph.on("node:mouseenter", (evt) => {
    const { item } = evt;
    graph.setItemState(item, "hover", true);
  });

  // 节点鼠标离开事件
  graph.on("node:mouseleave", (evt) => {
    const { item } = evt;
    graph.setItemState(item, "hover", false);
  });

  // 节点点击事件
  graph.on("node:click", (evt) => {
    const { item, target } = evt;
    const targetType = target.get("type");
    const name = target.get("name");

    // 增加元素
    if (targetType === "marker") {
      const model = item.getModel();
      if (name === "add-item") {
        if (!model.children) {
          model.children = [];
        }
        const id = `n-${Math.random()}`;
        model.children.push({
          id,
          label: id.substr(0, 8),
          leftIcon: {
            style: {
              fill: "#e6fffb",
              stroke: "#e6fffb",
            },
            img: "https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*Q_FQT6nwEC8AAAAAAAAAAABkARQnAQ",
          },
        });
        graph.updateChild(model, model.id);
      } else if (name === "remove-item") {
        graph.removeChild(model.id);
      }
    }
  });
});
</script>

<style scoped>
#container {
  width: 100%;
  height: 100vh;
}
</style>
