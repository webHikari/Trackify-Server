FROM oven/bun:1.2

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install

COPY . .

CMD ["sleep", "1"]

CMD ["bun", "run", "--watch", "src/index.ts"]
