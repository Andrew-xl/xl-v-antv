<template>
  <div :id="domId" style="width: 100%; height: 80vh"></div>
</template>

<script setup lang="ts">
// 导入所需的库和函数
import G6 from "@antv/g6";
import { nextTick, onMounted, defineProps } from "vue";
import { initData } from "./demo";
// 定义 props，接受一个 domId 字符串，默认值为 "container"
const props = defineProps({
  domId: {
    type: String,
    default: "container",
  },
});
const initRender = () => {
  // 获取容器元素
  const container = document.getElementById(props.domId);
  // 获取容器的宽度和高度
  const width = container?.scrollWidth as any;
  const height = container?.scrollHeight as any;

  // 注册自定义节点
  G6.registerNode("custom-node", {
    draw(cfg, group) {
      // 创建节点容器
      const shape = group.addShape("rect", {
        attrs: {
          x: -50, // 节点左上角 x 坐标
          y: -20, // 节点左上角 y 坐标
          width: 100, // 节点宽度
          height: 40, // 节点高度
          fill: "#F5F5F5", // 节点填充颜色
          stroke: "#D3D3D3", // 节点描边颜色
          radius: 4, // 节点圆角
          cursor: "pointer", // 设置鼠标样式为手型
        },
      });

      // 添加节点标签
      group.addShape("text", {
        attrs: {
          x: 0, // 标签 x 坐标
          y: 0, // 标签 y 坐标
          textAlign: "center", // 文本居中对齐
          textBaseline: "middle", // 文本垂直居中
          text: cfg.nodeName, // 显示节点名称
          fill: "#333", // 文本颜色
          fontSize: 14, // 文本字号
          fontWeight: "bold", // 文本加粗
        },
      });

      return shape;
    },
  });
  G6.registerEdge("custom-edge", {
    draw(cfg, group) {
      const startPoint = cfg.startPoint as any;
      const endPoint = cfg.endPoint as any;

      // 计算分叉点和转角点的位置
      const forkPoint = { x: startPoint.x, y: (startPoint.y + endPoint.y) / 2 };
      const cornerPoint = {
        x: endPoint.x - (cfg.targetNode as any).getModel().width / 2,
        y: forkPoint.y,
      };

      // 创建路径
      const path = [
        ["M", startPoint.x, startPoint.y], // 从父节点开始
        ["L", forkPoint.x, forkPoint.y], // 向下到分叉点
        ["L", cornerPoint.x, cornerPoint.y], // 向左或向右到转角点
        ["L", endPoint.x, endPoint.y], // 向下到子节点
      ];

      const shape = group.addShape("path", {
        attrs: {
          path: path,
          stroke: "#A3B1BF",
          lineWidth: 1.2,
          startArrow: cfg.startArrow,
          endArrow: cfg.endArrow,
        },
        name: "path-shape",
      });
      return shape;
    },
  });
  // 创建 G6 图实例
  const graph = new G6.TreeGraph({
    container: props.domId, // 指定容器
    width, // 宽度
    height, // 高度
    modes: {
      default: ["zoom-canvas"], // 只允许缩放画布，禁止拖拽画布和节点
    },
    fitViewPadding: [20, 40, 50, 40], // 自适应视图时的边距
    defaultNode: {
      type: "custom-node", // 自定义节点类型
      size: [100, 40], // 设置节点大小
      style: {
        fill: "#F5F5F5", // 节点填充颜色
        stroke: "#D3D3D3", // 节点描边颜色
        radius: 4, // 节点圆角
        cursor: "pointer", // 设置鼠标样式为手型
      },
    },
    defaultEdge: {
      type: "custom-edge", // 自定义边类型
    },
    layout: {
      type: "dendrogram", // 使用树状图布局
      direction: "TB", // 从上到下布局
      nodeSep: 200, // 节点间距
      rankSep: 100, // 层间距
      siblingSep: 50, // 兄弟节点间的距离
    },
  });

  // 计算中心位置
  const centerX = width / 2;
  const centerY = height / 2;

  // 添加+号节点
  const addNodeX = centerX;
  const addNodeY = centerY;
  graph.addItem("node", {
    id: "add-node",
    type: "custom-edge", // 自定义边类型
    x: addNodeX,
    y: addNodeY,
    nodeName: "+",
  });

  // 监听+号节点的点击事件
  graph.on("node:click", (evt) => {
    const { item } = evt as any;
    if (item.getID() === "add-node") {
      // TODO: 显示悬浮窗
      console.log("Clicked on the + node");
    }
  });

  // 加载数据并渲染图形
  graph.data(initData);
  graph.render();
  graph.fitView(); // 自适应视图

  // 监听窗口大小变化事件，调整图形大小
  if (typeof window !== "undefined") {
    window.onresize = () => {
      if (!graph || graph.get("destroyed")) return;
      if (!container || !container.scrollWidth || !container.scrollHeight)
        return;
      graph.changeSize(container.scrollWidth, container.scrollHeight);
    };
  }
};

// 在组件挂载后执行初始化渲染函数
onMounted(() => {
  nextTick(() => {
    initRender();
  });
});
</script>
