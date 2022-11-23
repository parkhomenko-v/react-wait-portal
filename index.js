'use strict';

ReactDOM
  .createRoot(document.querySelector('#output'))
  .render(<Page />);

function Page() {
  return (
    <div>
      <Title />
      <PortalOutput />
      <div style={{ backgroundColor: "gray", height: "1px", marginTop: "20px", marginBottom: "20px" }} />
      <PortalInput>
        <h2 style={{ margin: 0 }}>
          The content must be rendered into another component by React Portal
        </h2>
      </PortalInput>
    </div>
  );
}

function Title() {
  return (
    <div>
      <h1>Wait the element for React Portal</h1>
      <p>
        The issue is that sometimes element for portal is appends with some delay
      </p>
      <p>
        And it depends on different reasons
      </p>
      <p>
        This code snipped is solving the issue by waiting for 5 seconds while element (div element with green color) for portal will append into DOM
      </p>
    </div>
  );
}

function PortalOutput() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setShow(() => true), 5000)
  }, []);

  return (
    show
      ? <div data-portal-output={true} style={{ backgroundColor: "green", height: "30px", lineHeight: "30px" }} />
      : <div data-portal-output={false} style={{ backgroundColor: "red", height: "30px", lineHeight: "30px" }} />
  );
}

function PortalInput(props) {
  const wait = React.useRef((selector, delay, maxTries, callback) => {
    let timeout;

    const attempt = (remain) => {
      clearTimeout(timeout);

      if (remain === 0) {
        callback(`Reached the max number of attempts to find element by ${selector}`);
      } else {
        const container = document.querySelector(selector);

        if (container == null) {
          timeout = setTimeout(attempt, delay, remain - 1);
        } else {
          callback(null, container);
        }
      }
    };

    return attempt(maxTries);
  });
  const [node, setNode] = React.useState(null);

  React.useEffect(() => {
    wait.current('[data-portal-output=true]', 1000, 10, (error, container) => {
      if (container == null) {
        console.error(error);
      } else {
        setNode(() => container);
      }
    });
  }, []);

  return (
    <div style={{ backgroundColor: "yellow", height: "30px", lineHeight: "30px" }}>
      {node == null ? props.children : ReactDOM.createPortal(props.children, node)}
    </div>
  );
}
