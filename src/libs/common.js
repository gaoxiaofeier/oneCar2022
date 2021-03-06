/*
 * @Descripttion:  防抖节流组件，前提是页面在等待时间内无其他渲染方可使用，重新渲染导致 debounce() 函数不断重置
 * @version: X3版本
 * @Author: GaoFei
 * @Date: 2021-01-28 15:18:33
 * @LastEditors: GaoFei
 * @LastEditTime: 2021-01-28 15:45:41
 */
const debounce = (func, time, isDebounce, ctx) => {
    var timer, lastCall, rtn;
    if (isDebounce) {
        rtn = (...params) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(ctx, params);
            }, time);
        };
    } else {
        rtn = (...params) => {
            const now = new Date().getTime();
            if (now - lastCall < time && lastCall) return;
            lastCall = now;
            func.apply(ctx, params);
        };
    }
    return rtn;
};

export default {
    name: 'Throttle',
    abstract: true,
    props: {
        time: {
            type: Number,
            default: 800,
        },
        events: {
            type: String,
            default: 'click',
        },
        isDebounce: {
            type: Boolean,
            default: false,
        },
    },
    created() {
        this.eventKeys = this.events.split(',');
        this.originMap = {};
        this.debouncedMap = {};
    },
    render() {
        const vnode = this.$slots.default[0];
        this.eventKeys.forEach(key => {
            const target = vnode.data.on[key];
            if (target === this.originMap[key] && this.debouncedMap[key]) {
                vnode.data.on[key] = this.debouncedMap[key];
            } else if (target) {
                this.originMap[key] = target;
                this.debouncedMap[key] = debounce(
                    target,
                    this.time,
                    this.isDebounce,
                    vnode
                );
                vnode.data.on[key] = this.debouncedMap[key];
            }
        });
        return vnode;
    },
};