class Check < ActiveRecord::Base
  attr_accessible :candidate, :is_word, :user_uuid

  def self.get_range(params = {})
    query = self
    if params[:start] != nil
      query = query.where('id >= ?', params[:start])
    end
    if params[:end] != nil
      query = query.where('id <= ?', params[:end])
    end

    return query.order('id desc').limit(params.fetch(:count, 30)).map { |check| {
        :candidate => check[:candidate],
        :isWord => check[:is_word],
        :uid => check[:user_uuid],
        :timestamp => check[:created_at].to_i
      } 
    }
  end
end
