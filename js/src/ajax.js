export default async (name) => await (await fetch(name)).text();
