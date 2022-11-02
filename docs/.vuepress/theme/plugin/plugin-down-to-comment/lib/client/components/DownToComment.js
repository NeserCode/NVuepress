import { debounce } from 'ts-debounce';
import { computed, defineComponent, h, onMounted, ref, Transition, nextTick } from 'vue';
import { getScrollTop } from '../utils.js';
import '../styles/vars.css';
import '../styles/down-to-comment.css';
export const DownToComment = defineComponent({
    name: 'DownToComment',
    setup() {
        const scrollTop = ref(0);
        const show = computed(() => scrollTop.value > 300);
        const onScroll = debounce(() => {
            scrollTop.value = getScrollTop();
            nextTick(() => {
                hasComment.value = !(document.querySelector('#comment') === null)
            })
        }, 100);
        const hasComment = ref(!(document.querySelector('#comment') === null))
        onMounted(() => {
            scrollTop.value = getScrollTop();
            window.addEventListener('scroll', () => onScroll());
        });
        const downToCommentEl = h('div', {
            class: 'down-to-comment',
        }, [h('div', {
            class: 'down-to-comment__inner',
        }), h('a', {
            class: 'down-to-comment__link',
            href: '#comment',
        })]);
        return () => h(Transition, {
            name: 'down-to-comment',
            appear: true,
            mode: 'out-in',
        }, () => (show.value && hasComment.value ? downToCommentEl : null));
    },
});
export default DownToComment;
