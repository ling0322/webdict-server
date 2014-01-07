class CheckController < ApplicationController
  def create
    id = params[:id]
    user_uuid = cookies[:uuid]
    if Candidate.find(id)[:text] == params[:word]
      check = Check.new(:candidate => params[:word], :is_word => params[:isWord], :user_uuid => user_uuid)
      check.save
    else
      raise RuntimeError, 'Candidate id and word mismatch.'
    end
  
    render :nothing => true
  end

  def index
    render :json => Check.get_range
  end

  def count
    render :json => Check.count + 28923
  end
end
