---
title: "Style Showcase"
summary: "A tour of every styled component in the blog."
author: "John Rycca Belcina"
date: "July 7, 2026"

tags:
  - Demo
  - CSS
  - Win95
---


## H2 — Title of Topic

This is a second-level heading. Notice the left navy stripe — useful for separating major sections inside a post.

### H3 — Header

#### H4 - Sub Header
Third-level heading, plain bold. Good for nested topics without the visual weight of H2.

---

## Paragraphs and Inline Text

This is a regular paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames.

You can use **bold text** to emphasize a point, *italic text* for titles or soft emphasis, and `inline code` when referencing a variable or short snippet inline.

Links look like classic Win95 hyperlinks: [visit my GitHub](https://github.com/Zimgo012) — navy when unvisited, blue on hover, purple once visited.

---

## Blockquote

> Think twice, ship once, and debug multiple times.
>
> — A senior engineer who has been there

Blockquotes render as sunken inset panels — they sit below the surface of the document, like a quoted excerpt in Wordpad.

---

## Unordered List

- Backend development and distributed systems
- Infrastructure as code (Docker, AWS, Azure)
- Event-driven architecture with message queues
- REST and gRPC API design
- Real-time data pipelines

## Ordered List

1. Define the requirements clearly
2. Sketch the data model and API contract
3. Implement with tests alongside
4. Profile and optimize the hot paths
5. Write the post-mortem even if nothing broke

## Nested List

- Languages
  - Java, Spring Boot
  - JavaScript / TypeScript
  - C / C++
- Infrastructure
  - Docker, Kubernetes
  - AWS Lambda, S3, DynamoDB
  - Azure Functions

---

## Inline Code and Code Blocks

Reference a function inline like `getUserById(id: string)` or a terminal command like `npm run dev`.

A full block — rendered as a black CMD.exe terminal pane:

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

```bash
# Build and run with Docker
docker build -t my-app .
docker run -p 8080:8080 my-app
```

```sql
SELECT u.name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.name
ORDER BY order_count DESC;
```

---

## Horizontal Rule

The section above ends with an `<hr>`. Below is another one for demonstration — it renders as the classic Win95 double-line divider.

---

## Table

| Language    | Type       | Primary Use            |
|-------------|------------|------------------------|
| Java        | Compiled   | Backend services       |
| JavaScript  | Interpreted| Web / Node.js          |
| C           | Compiled   | Systems programming    |
| SQL         | Query      | Relational databases   |
| Bash        | Scripting  | Automation & DevOps    |

---

## Image

Images render with a raised Win95 picture-frame border.

![Welcome gif.](../../../../public/blog-pictures/welcome-blog/welcome.gif.webp)

---

## Everything Together

A real post mixes all of these. A heading introduces the topic, a paragraph sets context, a code block shows the implementation, a blockquote captures a key takeaway, and a table might summarize results. This file exists so you can visually verify every styled element in one place before writing actual content.
