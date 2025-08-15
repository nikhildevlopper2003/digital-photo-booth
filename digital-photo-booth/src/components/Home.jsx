import React from 'react'

const Home = () => {
  return (
    <div className="card mx-auto" style={{ maxWidth: '900px', width: '100%' }}>
      <div className="card-body text-center text-md-start">
        <h1 className="card-title">Welcome to Digital Photo Booth</h1>
        <p className="card-text">
          Capture your special moments and create beautiful Spotify-style strips to share with friends.
        </p>
        <div className="d-grid d-md-inline">
          <a href="/" className="btn btn-primary w-100 w-md-auto">Start Capturing</a>
        </div>
      </div>
    </div>
  )
}

export default Home
