import { defineComponent } from "vue";
import { useDark, useToggle } from "@vueuse/core";
import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElSpace,
} from "element-plus";
import { RouterLink } from "vue-router";

const App = defineComponent(
  () => {
    const isDark = useDark();
    const toggleDark = useToggle(isDark);
    return () => {
      return (
        <div class="dark:bg-black bg-slate-50 p-4">
          <header class="flex justify-center">
            <ElSpace>
              <ElButton
                onClick={() => {
                  toggleDark();
                }}
              >
                Toggle Dark Mode
              </ElButton>
              <ElDropdown>
                {{
                  default: () => <ElButton>Router</ElButton>,
                  dropdown: () => (
                    <div>
                      <ElDropdownMenu>
                        <ElDropdownItem>
                          <RouterLink to="/">base</RouterLink>
                        </ElDropdownItem>
                        <ElDropdownItem>
                          <RouterLink to="/multi">multi</RouterLink>
                        </ElDropdownItem>
                      </ElDropdownMenu>
                    </div>
                  ),
                }}
              </ElDropdown>
            </ElSpace>
          </header>
          <main class="p-4">
            <router-view />
          </main>
        </div>
      );
    };
  },
  {
    props: [],
  }
);

export default App;
