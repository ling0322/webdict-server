require 'securerandom'

class HomeController < ApplicationController
  def index
    @random_candidate = Candidate.random_candidate
    @check_log = Check.get_range(:count => 10)
    @count = Check.count + 28923

    if cookies[:uuid] == nil
      cookies.permanent[:uuid] = SecureRandom.uuid()
    end
  end
end
