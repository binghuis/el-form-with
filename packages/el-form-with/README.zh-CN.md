# el-form-with

[English](./README.md) · 简体中文

<div align="left">

`el-form-with` 是一个用于简化 `Form` 和其他组件结合使用的高阶组件库。

[![npm version](https://img.shields.io/npm/v/el-form-with?style=flat-square)](https://www.npmjs.com/package/el-form-with)
[![GitHub](https://img.shields.io/github/license/binghuis/el-form-with.svg?style=flat-square)](https://github.com/binghuis/el-form-with/blob/main/LICENSE)
![vue peer dependency version](https://img.shields.io/npm/dependency-version/el-form-with/peer/vue?style=flat-square)
![element-plus peer dependency version](https://img.shields.io/npm/dependency-version/el-form-with/peer/element-plus?style=flat-square)

</div>

ToB 业务中 `Form`、`Table`、弹层 UI `Modal`、`Drawer` 等组件的联动非常常见。这类逻辑简单、重复性强、繁琐。

`el-form-with` 实现的是封装组件的联动逻辑并返回组合组件。

## 安装

您可以使用 pnpm 来安装 `el-form-with`：

`pnpm i el-form-with`

## 如何使用

```tsx
import { withModal, withDrawer, withTable } from "el-form-with";
import type { WithModalRef } from "el-form-with";
import { ref, defineComponent } from "vue";
import { ElDivider, ElPagination } from "element-plus";
import FormContainer from "";
import TableContainer from "";
import TableSelectorContainer from "";

export default defineComponent({
  setup() {
    const ModalWithFormRef = ref<WithModalRef>();
    const ModalWithForm = withModal({
      async submit({ data, mode, record }) {
        return "success";
      },
    })(FormContainer);

    const TableWithOverlay = withTable({
      async requester() {
        return {
          list: [],
          total: 0,
        };
      },
    });

    return (
      <div>
        <ModalWithForm destroyOnClose ref={ModalWithFormRef} />
        <TableWithOverlay forms={{ ModalWithFormRef }}>
          {{
            selector: (props) => <TableSelectorContainer {...props} />,
            table: (props) => <TableContainer {...props} />,
            pagination: (props) => (
              <div>
                <ElDivider />
                <ElPagination {...props} />
              </div>
            ),
          }}
        </TableWithOverlay>
      </div>
    );
  },
});
```

## 在线示例

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/binghuis/el-form-with/tree/main/samples/basic)

## License

MIT License.
