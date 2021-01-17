const { filterLinks, generatePages, validators } = require("./util");
const linkArray = [
  {
    createdTime: "2021-01-17T13:14:07.536Z",
    id: 536,
    title: "test1",
    vote: 3,
  },
  {
    createdTime: "2021-01-17T17:19:36.714Z",
    id: 714,
    title: "test2",
    vote: 3,
  },
  {
    createdTime: "2021-01-17T17:19:34.530Z",
    id: 530,
    title: "test3",
    vote: 0,
  },
];
test("filter output links desc", () => {
  const filterDesc = filterLinks(linkArray, "desc");
  expect(filterDesc).toEqual([
    {
      createdTime: "2021-01-17T17:19:36.714Z",
      id: 714,
      title: "test2",
      vote: 3,
    },
    {
      createdTime: "2021-01-17T13:14:07.536Z",
      id: 536,
      title: "test1",
      vote: 3,
    },
    {
      createdTime: "2021-01-17T17:19:34.530Z",
      id: 530,
      title: "test3",
      vote: 0,
    },
  ]);
});

test("filter output links asc", () => {
  const filterAsc = filterLinks(linkArray, "asc");
  expect(filterAsc).toEqual([
    {
      createdTime: "2021-01-17T17:19:34.530Z",
      id: 530,
      title: "test3",
      vote: 0,
    },
    {
      createdTime: "2021-01-17T17:19:36.714Z",
      id: 714,
      title: "test2",
      vote: 3,
    },
    {
      createdTime: "2021-01-17T13:14:07.536Z",
      id: 536,
      title: "test1",
      vote: 3,
    },
  ]);
});

test("should page count", () => {
  const pageCount = generatePages(9);
  expect(pageCount).toEqual([1, 2]);
});

test("should input validate", () => {
  const isValid = validators("test", "required");
  expect(isValid).toBe(true);
});

test("should empty input validate", () => {
  const isValid = validators("", "required");
  expect(isValid).toBe(false);
});
