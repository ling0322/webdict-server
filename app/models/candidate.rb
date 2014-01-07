class Candidate < ActiveRecord::Base
  attr_accessible :examples, :text

  def self.random_candidate(limit = 10)
    candidate_list = order('random()').limit(limit).map { |candidate| {
       :word => candidate[:text], 
       :examples => candidate[:examples],
       :id => candidate[:id]
      }
    }

    return candidate_list
  end
end
