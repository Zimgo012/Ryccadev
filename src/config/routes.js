const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : import.meta.env.BASE_URL + "/";

export const ROUTES = {
    home: base,
    blogs: `${base}blogs`,
    projects: `${base}projects`,
};