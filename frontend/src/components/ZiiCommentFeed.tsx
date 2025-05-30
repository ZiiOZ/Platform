<div className="mt-4 space-y-4">
  {comments.length === 0 ? (
    <div className="text-center text-gray-400 italic">
      No comments yet — be the first!
    </div>
  ) : (
    comments.map((comment) => (
      <div
        key={comment.id}
        className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-2"
      >
        <div className="text-sm text-gray-800">{comment.content}</div>

        <button
          className={`text-xs px-3 py-1 rounded-full transition ${
            replies[comment.id]
              ? 'text-gray-400 border border-gray-300 cursor-default'
              : 'text-purple-600 border border-purple-600 hover:bg-purple-50'
          }`}
          disabled={!!replies[comment.id] || loadingReply === comment.id}
          onClick={() => handleZiiBotReply(comment.id, comment.content)}
        >
          {loadingReply === comment.id ? 'ZiiBot typing...' : 'Ask ZiiBot 🤖'}
        </button>

        {replies[comment.id] && (
          <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded-xl border border-blue-200">
            {replies[comment.id]}
          </div>
        )}
      </div>
    ))
  )}
</div>
