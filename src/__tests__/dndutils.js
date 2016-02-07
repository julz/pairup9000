import React from 'react';

import { DragDropContext } from 'react-dnd';
import TestBackend from 'react-dnd-test-backend';

export function wrapInTestDNDContext(DecoratedComponent) {
  return DragDropContext(TestBackend)(
    React.createClass({
      render: function () {
        return <DecoratedComponent {...this.props} />;
      }
    })
  );
}
