import {createRouter, createWebHistory} from "vue-router";
import shiyan01 from "../components/shiyan01.vue";
import index from "../components/index.vue";
import shiyan02 from "../components/shiyan02.vue";
import shiyan03 from "../components/shiyan03.vue";
import shiyan04 from "../components/shiyan04.vue";
import shiyan05 from "../components/shiyan05.vue";
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: index
        },
        {
            path: "/shiyan01",
            component: shiyan01
        },
        {
            path: "/shiyan02",
            component: shiyan02
        },
        {
            path: "/shiyan03",
            component: shiyan03
        },
        {
            path: "/shiyan04",
            component: shiyan04
        },
        {
            path: "/shiyan05",
            component: shiyan05
        }


    ]
})
export default router;
