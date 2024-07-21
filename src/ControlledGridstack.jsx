// 参考demo:https://codesandbox.io/p/github/QiuYiLiang/test-gridstack/main
import React, { useLayoutEffect, useEffect, createRef, useRef } from 'react';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import 'gridstack/dist/gridstack-extra.min.css';

const ControlledStack = props => {
  const { items, onChange, options, itemRender } = props;
  // 容器
  const containerRef = useRef();
  // 实例
  const gridRef = useRef();
  // 所有子节点
  const refs = useRef({});

  const refKeys = Object.keys(refs.current);
  const itemsIds = items.map(item => {
    return item.id;
  });
  const isSameItems =
    refKeys.length === itemsIds.length && refKeys.every(wId => itemsIds.includes(wId));
  // 长度相等且id相同
  if (!isSameItems) {
    const refTmpList = {};
    itemsIds.forEach(id => {
      refTmpList[id] = refs.current[id] || createRef();
    });
    refs.current = refTmpList;
  }

  useEffect(() => {
    return () => {
      if (gridRef.current) {
        gridRef.current.destroy();
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (!gridRef.current) {
      gridRef.current = GridStack.init(options, containerRef.current);
      const grid = gridRef.current;

      grid.on('added', (ev, gsItems) => {
        if (grid._ignoreCB) {
          return;
        }
      });

      grid.on('removed change', (ev, gsItems) => {
        let data = grid.save(false);
        if (ev.type === 'change') {
          // 由于getData()在列变化时获取数据不准，处理如下
          data = data.map(item => {
            const curItem = gsItems.find(gItem => gItem.id === item.id);
            if (curItem) {
              return {
                ...item,
                x: curItem.x,
                y: curItem.y,
                w: curItem.w,
                h: curItem.h,
              };
            }
            return item;
          });
        }
        onChange(data);
      });
    } else {
      const grid = gridRef.current;
      if (grid) {
        const layout = items.map(a => {
          // use exiting nodes (which will skip diffs being the same) else new elements Widget but passing the React dom .el so we know what to makeWidget() on!
          return (
            refs.current[a.id].current.gridstackNode || { ...a, el: refs.current[a.id].current }
          );
        });
        grid._ignoreCB = true; // hack: ignore added/removed since we're the one doing the update
        grid.load(layout);
        delete grid._ignoreCB;
      }
    }
  }, [items]);

  return (
    <div className="grid-stack" ref={containerRef}>
      {items.map(item => {
        return (
          <div
            ref={refs.current[item.id]}
            className="grid-stack-item"
            gs-id={item.id}
            gs-w={item.w}
            gs-h={item.h}
            gs-x={item.x}
            gs-y={item.y}
            gs-min-w={item.minW}
            gs-min-h={item.minH}
            gs-max-w={item.maxW}
            gs-max-h={item.maxH}
            key={item.id}
          >
            <div className="grid-stack-item-content">{itemRender(item)}</div>
          </div>
        );
      })}
    </div>
  );
};

ControlledStack.defaultProps = {
  // 配置项
  options: {
    float: true, // true则不自动向上对齐
    minRow: 1,
    cellHeight: 148,
    margin: 6,
    column: 5, // 设置成5列
    // resizable: {
    //   handles: 'all',
    // },
    alwaysShowResizeHandle: false, // 默认不显示拖拽图标
    columnOpts: {
      breakpointForWindow: true, // 默认监听grid变化,设为true改为window
      breakpoints: [
        { w: 1400, c: 2 }, // window小于该宽度，则全部显示2列
        { w: 1640, c: 4 }, // window小于该宽度，则全部显示4列
      ],
      columnMax: 5,
      layout: 'compact',
    },
  },
  // 自定义渲染
  itemRender: () => null,
  // 改变事件
  onChange: () => {},
};

export default ControlledStack;

