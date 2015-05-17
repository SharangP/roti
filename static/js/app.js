var Post = React.createClass({
    handleVote: function(vote_inc) {
        return function(e) {
            e.preventDefault();
            $.ajax({
                url: 'api/post/' + this.props.id,
                dataType: 'json',
                contentType: 'application/json',
                type: 'PATCH',
                data: JSON.stringify({ 'votes': this.props.votes + vote_inc }),
                success: function(data) {
                    this.props.loadPosts();
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error('api/post', status, err.toString());
                }.bind(this)
            });
        }.bind(this);
    },
    render: function() {
        var metaStyle = {
            'display': 'inline',
            'margin-right': '20px'
        };

        var voteStyle = {
            'margin': '2px'
        };

        var formStyle = {
            'margin-bottom': '5px',
            'margin-top': '5px',
            'display': 'inline'
        };

        return (
            <div className="post">
                <div className="meta">
                    <div className="voteinfo" style={metaStyle}>
                        <form className="upvoteform" onSubmit={this.handleVote(1)} style={formStyle}>
                            <input type="hidden" value="1" />
                            <input type="submit" value="+" />
                        </form>

                        <h2 className="votes" style={voteStyle}>
                            { this.props.votes }
                        </h2>

                        <form className="downvoteform" onSubmit={this.handleVote(-1)} style={formStyle}>
                            <input type="hidden" value="-1" />
                            <input type="submit" value="-" />
                        </form>
                    </div>
                    <div className="otherinfo" style={metaStyle}>
                        <h3 className="author" style={metaStyle}>
                            { this.props.author }
                        </h3>
                        <h3 className="posted" style={metaStyle}>
                            { this.props.posted }
                        </h3>
                    </div>
                </div>
                <p className="content">
                    { this.props.content }
                </p>
                <hr/>
            </div>
        );
    }
});

var PostForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var author = React.findDOMNode(this.refs.author).value.trim();
        var content = React.findDOMNode(this.refs.content).value.trim();
        if (!author || !content) return;

        $.ajax({
            url: 'api/post',
            dataType: 'json',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({ 'author': author, 'content': content }),
            success: function(data) {
                this.props.loadPosts();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('api/post', status, err.toString());
            }.bind(this)
        });

        React.findDOMNode(this.refs.author).value = '';
        React.findDOMNode(this.refs.content).value = '';
    },

    render: function() {
        return (
            <form className="postform" onSubmit={this.handleSubmit}>
                <textarea cols="50" rows="3" placeholder="Post" ref="content"></textarea>
                <br/>
                <input type="text" placeholder="Author" ref="author" />
                <input type="submit" value="Submit" />
            </form>
        );
    }
});


var Posts = React.createClass({
    getInitialState: function() {
        return {data: []};
    },

    componentDidMount: function() {
        this.loadPosts();
        setInterval(this.loadPosts, this.props.pollInterval);
    },

    loadPosts: function() {
        $.ajax({
            url: 'api/post',
            dataType: 'json',
            success: function(data) {
                sortedObjects = data.objects.sort(function(a, b) {
                    if (a['votes'] < b['votes'])
                        return 1;
                    else if (a['votes'] > b['votes'])
                        return -1;
                    else if (a['posted'] < b['posted'])
                        return 1;
                    else
                        return -1;
                });
                this.setState({data: sortedObjects})
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('api/post', status, err.toString());
            }.bind(this)
        });
    },

    render: function() {
        var content = [];

        for (var i = 0; i < this.state.data.length; i++) {
            var post = this.state.data[i];
            content.push(
                <Post
                    id={post.id}
                    votes={post.votes}
                    content={post.content}
                    posted={post.posted}
                    author={post.author}
                    loadPosts={this.loadPosts} />
            );
        }

        return (
            <div className="posts">
                <h2>Create a fact</h2>
                <PostForm loadPosts={this.loadPosts}/>
                <hr/>
                <h2>Top facts</h2>
                {content}
            </div>
        );
    }
})

React.render(
    <Posts pollInterval={5000} />,
    document.body
);
