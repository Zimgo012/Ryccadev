import {ROUTES} from './routes.js';

export const sections = {
    projects: {
        label: "Projects",
        icon: ROUTES.home +  "icons/w2k-programs.ico",
        collection: "projects",
        template: "projectPreview"
    },

    blogs: {
        label: "Blogs",
        icon: ROUTES.home + "icons/w95_64.ico",
        collection: "blogs",
        template: "blogPreview"
    },

    // others: {
    //     label: "Others",
    //     icon: "/w95_44.ico",
    //     collection: "others",
    //     template: "defaultPreview"
    // }
};