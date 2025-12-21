# Synopsis

I want to create an original React library for generating configurable multi-chart graphs using ECharts. The library should allow users to inject arbitrary data, dynamically infer the data types, and automatically apply appropriate typing to render the charts correctly in ECharts. The solution should integrate seamlessly with React and support Tailwind CSS for styling. Look at mcp-server-chart for create these graphs and add fake data in src/data.

1. Accept arbitrary data input from users
2. Dynamically infer data types from the provided data
3. Automatically apply appropriate typing to ensure correct rendering in ECharts
4. Integrate seamlessly with React applications
5. Support Tailwind CSS for styling components
6. Use mcp-server-chart as a reference implementation for creating charts
7. Include fake data in the src/data directory for demonstration purposes

Follow the architectural requirements specified in the document, utilizing TanStack Start as the framework, ECharts 6 for charting functionality, react-for-echarts for React integration, and Tailwind 6 for styling. Ensure the implementation aligns with the project's existing architecture and technology stack.

# Details

- Implement Server-Side Rendering (SSR) mode for data fetching on the server, and replace the content of the @index.tsx file with the SSR-enabled implementation.

- Implement the new ECharts 6 theme and dark mode system as described in the documentation (https://echarts.apache.org/handbook/en/basics/release-note/v6-feature#2.-dynamic-theme-switching). Use the provided code snippet to detect the system's preferred color scheme and automatically switch between 'dark' and 'default' themes for all charts:

```javascript
const darkModeMediaQuery = window.matchers('(prefers-color-scheme: dark)');
function updateDarkMode() {
    const isDarkMode = darkModeMediaQuery.matches;
    for (const chart of charts) {
        chart.setTheme(isDarkMode ? 'dark' : 'default');
    }
}
darkModeMediaQuery.addEventListener('change', () => {
    updateDarkMode();
});
```

Additionally, implement a manual theme control using a Rsuite 6 Panel component in the sidebar of the React page. This control should allow users to override the automatic system preference and manually toggle between light and dark modes for all charts. Ensure that both the automatic system preference detection and the manual override work seamlessly together, with the manual setting taking precedence when active.

- I want to implement all the chart types I need and be able to compose them in the desired ECharts layout. For reference, here is an example code in vanilla JS demonstrating the matrix grid layout: https://echarts.apache.org/examples/en/editor.html?c=matrix-grid-layout. The implementation should follow the architectural requirements specified in the spec.md file, utilizing TanStack Start as the framework, ECharts 6 for charting functionality, react-for-echarts for React integration, and Tailwind 6 for styling. The solution should allow users to inject arbitrary data, dynamically infer data types, automatically apply appropriate typing for correct ECharts rendering, integrate seamlessly with React applications, and support Tailwind CSS for styling components.

# Projects and doc context

## Architecture

- Tanstack Start (see memory for doc)

## Libs

- Echarts 6 (use context7 for old doc V5, else not use https://echarts.apache.org/handbook/en/basics/release-note/v6-feature)

- react-for-echarts (use context7) and react-for-echarts is able to call MCP mcp-server-chart for build chart

- tailwind 6 (context7)