import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Form } from './components/form/Form';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Form />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
