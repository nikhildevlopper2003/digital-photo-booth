import React from 'react'

const Contact = () => {
  return (
    <div className="card mx-auto" style={{ maxWidth: '900px', width: '100%' }}>
      <div className="card-body">
        <h1 className="card-title text-center text-md-start">Contact Us</h1>
        <form className="w-100">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" placeholder="Your name" />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" placeholder="you@example.com" />
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea className="form-control" id="message" rows="3" placeholder="Write your message"></textarea>
          </div>
          <div className="d-grid d-md-block">
            <button type="submit" className="btn btn-primary w-100 w-md-auto">Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Contact
