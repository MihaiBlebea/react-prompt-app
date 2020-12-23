import React from 'react'
import './App.css'
import axios from 'axios'

export default class App extends React.Component
{    
    constructor()
    {
        super()
        this.state = {
            scrollIntervalId: null,
            highlightIntervalId: null,
            highlightSpeed: 1,
            highlightIndex: 0,
            prompterHeight: 0,
            content: null
        }
    }

    async componentDidMount()
    {
        await this.handleContent()

        this.handleHighlight()

        this.handleScreenHeight()
    }

    async handleContent()
    {
        let result = await axios.get('https://raw.githubusercontent.com/MihaiBlebea/react-prompt-app/master/store/lecture1.md')
        this.setState({
            ...this.state,
            content: result.data
        })
    }

    handleScreenHeight()
    {
        let h = window.screen.height - 100
        this.setState({
            ...this.state,
            prompterHeight: h
        })
    }

    handleScroll()
    {
        let prompt = document.querySelector('.Prompter')

        let intervalId = setInterval(()=> {
            prompt.scrollTop += 1
        }, 200)

        this.setState({
            ...this.state,
            scrollIntervalId: intervalId
        })
    }

    handlePauseScroll()
    {
        if (this.state.scrollIntervalId === null) {
            this.handleScroll()
            return
        }

        clearInterval(this.state.scrollIntervalId)
        this.setState({
            ...this.state,
            scrollIntervalId: null
        })
    }

    handleHighlight()
    {
        let highlightId = setInterval(()=> {
            this.setState({
                ...this.state,
                highlightIndex: this.state.highlightIndex + this.state.highlightSpeed
            })
        }, 100)

        this.setState({
            ...this.state,
            highlightIntervalId: highlightId
        })
    }

    handlePauseHighlight()
    {
        if (this.state.highlightIntervalId === null) {
            this.handleHighlight()
            return
        }

        clearInterval(this.state.highlightIntervalId)
        this.setState({
            ...this.state,
            highlightIntervalId: null
        })
    }

    handleHighlightSpeedIncrease()
    {
        let factor = 0.1
        this.setState({
            ...this.state,
            highlightSpeed: parseFloat((this.state.highlightSpeed + factor).toFixed(2))
        })
    }

    handleHighlightSpeedDecrease()
    {
        if (this.state.highlightSpeed === 0) {
            return
        }

        let factor = 0.1
    
        this.setState({
            ...this.state,
            highlightSpeed: parseFloat((this.state.highlightSpeed - factor).toFixed(2))
        })
    }

    renderHighlight()
    {
        if (this.state.content === null) {
            return ""
        }

        return this.state.content.substring(0, this.state.highlightIndex)
    }

    renderContent()
    {
        if (this.state.content === null) {
            return ""
        }

        return this.state.content.substring(this.state.highlightIndex)
    }

    render()
    {
        return (
            <div className="container my-4">
                <div className="row justify-content-center mb-3">
                    <div className="col-md-6 d-flex justify-content-between">
                        <div>
                            <button className="btn btn-outline-primary" onClick={ this.handlePauseScroll.bind(this) }>Scroll</button>
                            <button className="btn btn-outline-primary" onClick={ this.handlePauseHighlight.bind(this) }>Highlight</button>
                        </div>
                        <div className="d-flex align-items-center">
                            <button className="btn btn-outline-primary" onClick={ this.handleHighlightSpeedIncrease.bind(this) }>+</button>
                            <div className="px-4">{ this.state.highlightSpeed }</div>
                            <button className="btn btn-outline-primary" onClick={ this.handleHighlightSpeedDecrease.bind(this) }>-</button>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center" onClick={ this.handlePauseHighlight.bind(this) }>
                    <div className="col-md-6 border border-success Prompter" style={{height: this.state.prompterHeight + 'px' }}>
                        <span className="Highlight">{ this.renderHighlight() }</span>{ this.renderContent() }
                    </div>
                </div>
            </div>
        )
    }
}
