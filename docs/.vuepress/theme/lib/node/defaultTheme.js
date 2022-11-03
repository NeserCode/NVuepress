import { activeHeaderLinksPlugin } from '@vuepress/plugin-active-header-links';
import { backToTopPlugin } from '../../plugin/plugin-back-to-top';
import { downToCommentPlugin } from '../../plugin/plugin-down-to-comment';
import { containerPlugin } from '@vuepress/plugin-container';
import { externalLinkIconPlugin } from '@vuepress/plugin-external-link-icon';
import { gitPlugin } from '@vuepress/plugin-git';
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom';
import { nprogressPlugin } from '@vuepress/plugin-nprogress';
import { palettePlugin } from '@vuepress/plugin-palette';
import { prismjsPlugin } from '@vuepress/plugin-prismjs';
import { blogPlugin } from "vuepress-plugin-blog2";
import { searchPlugin } from "@vuepress/plugin-search"
import { tocPlugin } from "@vuepress/plugin-toc"
import { copyCodePlugin } from "vuepress-plugin-copy-code2"
import { readingTimePlugin } from "vuepress-plugin-reading-time2"
import { registerComponentsPlugin } from "@vuepress/plugin-register-components"
import { themeDataPlugin } from '@vuepress/plugin-theme-data';
import { fs, getDirname, path } from '@vuepress/utils';
import { assignDefaultLocaleOptions, resolveContainerPluginOptions, } from './utils/index.js';
const __dirname = getDirname(import.meta.url);
export const defaultTheme = ({ themePlugins = {}, ...localeOptions } = {}) => {
    assignDefaultLocaleOptions(localeOptions);
    return {
        name: '@vuepress/theme-default',
        templateBuild: path.resolve(__dirname, '../../templates/build.html'),
        alias: {
            // use alias to make all components replaceable
            ...Object.fromEntries(fs
                .readdirSync(path.resolve(__dirname, '../client/components'))
                .filter((file) => file.endsWith('.vue'))
                .map((file) => [
                    `@theme/${file}`,
                    path.resolve(__dirname, '../client/components', file),
                ])),
            // workaround for https://github.com/vitejs/vite/issues/7621
            '@vuepress/theme-default/client': path.resolve(__dirname, '../client/index.js'),
        },
        clientConfigFile: path.resolve(__dirname, '../client/config.js'),
        extendsPage: (page) => {
            // save relative file path into page data to generate edit link
            page.data.filePathRelative = page.filePathRelative;
            // save title into route meta to generate navbar and sidebar
            page.routeMeta.title = page.title;
            page.routeMeta.date = page.data.git?.createdTime ?? page.date;
        },
        plugins: [
            // @vuepress/plugin-active-header-link
            themePlugins.activeHeaderLinks !== false
                ? activeHeaderLinksPlugin({
                    headerLinkSelector: 'a.sidebar-item',
                    headerAnchorSelector: '.header-anchor',
                    // should greater than page transition duration
                    delay: 300,
                    offset: 5,
                })
                : [],
            // @vuepress/plugin-back-to-top
            themePlugins.backToTop !== false ? backToTopPlugin() : [],
            themePlugins.downToComment !== false ? downToCommentPlugin() : [],
            // @vuepress/plugin-container
            themePlugins.container?.tip !== false
                ? containerPlugin(resolveContainerPluginOptions(localeOptions, 'tip'))
                : [],
            themePlugins.container?.warning !== false
                ? containerPlugin(resolveContainerPluginOptions(localeOptions, 'warning'))
                : [],
            themePlugins.container?.danger !== false
                ? containerPlugin(resolveContainerPluginOptions(localeOptions, 'danger'))
                : [],
            themePlugins.container?.details !== false
                ? containerPlugin({
                    type: 'details',
                    before: (info) => `<details class="custom-container details">${info ? `<summary>${info}</summary>` : ''}\n`,
                    after: () => '</details>\n',
                })
                : [],
            themePlugins.container?.codeGroup !== false
                ? containerPlugin({
                    type: 'code-group',
                    before: () => `<CodeGroup>\n`,
                    after: () => '</CodeGroup>\n',
                })
                : [],
            themePlugins.container?.codeGroupItem !== false
                ? containerPlugin({
                    type: 'code-group-item',
                    before: (info) => `<CodeGroupItem title="${info}">\n`,
                    after: () => '</CodeGroupItem>\n',
                })
                : [],
            // @vuepress/plugin-external-link-icon
            themePlugins.externalLinkIcon !== false
                ? externalLinkIconPlugin({
                    locales: Object.entries(localeOptions.locales || {}).reduce((result, [key, value]) => {
                        result[key] = {
                            openInNewWindow: value.openInNewWindow ?? localeOptions.openInNewWindow,
                        };
                        return result;
                    }, {}),
                })
                : [],
            // @vuepress/plugin-git
            themePlugins.git !== false
                ? gitPlugin({
                    createdTime: true,
                    updatedTime: localeOptions.lastUpdated !== false,
                    contributors: localeOptions.contributors !== false,
                })
                : [],
            // @vuepress/plugin-medium-zoom
            themePlugins.mediumZoom !== false
                ? mediumZoomPlugin({
                    selector: '.theme-default-content > img, .theme-default-content :not(a) > img',
                    zoomOptions: {},
                    // should greater than page transition duration
                    delay: 300,
                })
                : [],
            // @vuepress/plugin-nprogress
            themePlugins.nprogress !== false ? nprogressPlugin() : [],
            // @vuepress/plugin-palette
            palettePlugin({ preset: 'sass' }),
            // @vuepress/plugin-prismjs
            themePlugins.prismjs !== false ? prismjsPlugin() : [],
            themePlugins.blog !== false ?
                blogPlugin({
                    filter: ({ filePathRelative, frontmatter }) => {
                        // 舍弃那些不是从 Markdown 文件生成的页面
                        if (!filePathRelative) return false;

                        // 舍弃 `archives` 文件夹的页面
                        if (filePathRelative.startsWith("archives/")) return false;

                        // 舍弃 `docs` 文件夹的页面
                        if (filePathRelative.startsWith("docs/")) return false;

                        // 舍弃那些没有使用默认布局的页面
                        if (frontmatter.home || frontmatter.layout) return false;

                        return true;
                    },

                    getInfo: (page) => {
                        const { excerpt, git = {}, frontmatter, title } = page

                        // 获取页面信息
                        const info = {
                            author: frontmatter.author || "",
                            categories: frontmatter.categories || [],
                            date: frontmatter.date || git?.createdTime || null,
                            tags: frontmatter.tags || frontmatter.tag || [],
                            excerpt,
                            title
                        };

                        return info;
                    },
                    category: [
                        {
                            key: "tag",
                            getter: ({ frontmatter }) => (frontmatter.tag || []),
                            path: "/tag/",
                            layout: "TagPage",
                            frontmatter: (path) => ({ title: "标签分类", localePath: path }),
                            itemPath: "/tag/:name/",
                            itemLayout: "TagPage",
                            itemFrontmatter: (name, path) => ({ title: `${name} 标签`, localePath: path }),
                        },
                    ],
                    type: [
                        {
                            key: "timeLine",
                            filter: (page) => page.data.path.startsWith("/blog/"),
                            sorter: (pageA, pageB) => new Date(pageB.frontmatter.date).getTime() - new Date(pageA.frontmatter.date).getTime(),
                            path: "/timeLine/",
                            layout: "TimeLine",
                            frontmatter: (path) => ({ title: "TimeLine", localePath: path }),
                        }
                    ],
                }) : [],
            // @vuepress/plugin-theme-data
            themeDataPlugin({ themeData: localeOptions }),
            searchPlugin(),
            tocPlugin(),
            copyCodePlugin({
                showInMobile: true,
                locales: {
                    "/": {
                        hint: "复制这份代码",
                        copy: "已复制 ",
                    },
                },
            }),
            readingTimePlugin({}),
            registerComponentsPlugin({
                componentsDir: path.resolve(__dirname, "./components"),
            }),
        ],
    };
};
